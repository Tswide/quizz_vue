<template>
  <div class="body">
    <div class="home-view centered-content">
      <h1 class="title">{{ title }}</h1>
      <ul>
        <li class="centered-content">
          <div  v-if="i !== -1" class="compteur-container">
            <Compteur @counterZero="handleCounterZero" ref="CompteurComponent" />
              <button @click="togglePlay" v-if="i !== -1 && id_category == 2">
                <img class="audio_img" v-show="isPlaying" src="../assets/Images/pause-button.svg" alt="Pause">
                <img class="audio_img" v-show="!isPlaying" src="../assets/Images/play-button.svg" alt="Play">
              </button>
          </div>
          <h2 v-if="id_category == 1" class="subtitle">{{ artist }} </h2>
            <h2 v-if="i === -1">Cliquez sur Lancer le jeu pour lancer la partie</h2>
          <div v-if="id_category == 1 && i != -1" class="centered-rectangle centered-content">
            <div class="inner-rectangle centered-content">
              <p v-if="id_category == 1 " class="lyrics" v-html="formatLyrics()"></p>
            </div>
          </div>
          <div class="containers" v-if="id_category == 2">
            <div class="containers_div" v-for="proposition in propositions" :key="proposition">
              <button class="containers_btn" :disabled="isFinished" @click="selectProposition(proposition)">
                {{ proposition }}
              </button>
            </div>
          </div>

          <div class="bottom-section centered-content">
            <Input ref="input" :answeInput="answerInput" :disabled="isFinished" @input-value-changed="updateInputValue" v-if="id_category == 1 &&  i !== -1 " />
            <Button :buttonValue="buttonValue" @validate="handleValidation" @click="nextQuestion"/>
          </div>
        </li>
      </ul>
      <div v-if="id_category == 2 ">
        <audio ref="audioPlayer" controls></audio>
      </div>
    </div>
    <Notification :show="showNotification" :isValid="isValid" :correctAnswer="correctAnswer" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Compteur from '@/components/Compteur.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';
import Notification from "@/components/Notification.vue"
import { saveAnswers, savePoints, saveCategoryId } from '@/core/localStorage';

const router = useRouter();
const props = defineProps(['id_category']);

const isValid = ref(false);
const correctAnswer = ref('');
const questions = ref([]);
const inputValue = ref('');
const lyrics = ref('');
const title = ref('');
const artist = ref('');
const buttonValue = ref('Lancer le jeu');
const isFinished = ref(false);
const showNotification = ref(false);
const CompteurComponent = ref();
const isPlaying = ref(false);
const selectedProposition = ref('');
const answerInput = ref(null);

let propositions = [];
let answers = [];
let points = [];
let i = -1;
let inputWords = "";

const fetchQuestions = async () => {
  try {
    const response = await axios.get(`https://quizz-musical-backend.airdev.be/api/categories/${props.id_category}`);
    saveCategoryId(props.id_category);
    questions.value = response.data.questions.filter(question => question.is_active === 1);
    getQuestions();
  } catch (error) {
    console.error('Erreur lors de la récupération des questions', error);
  }
};

const formatLyrics = () => {
  const lines = lyrics.value.split('\n');
  return lines.map(line => `<p>${line}</p>`).join('');
};

const updateInputValue = (value) => {
  inputValue.value = value;
};

const resetInputValue = () => {
  inputValue.value = '';
};

function getQuestions() {
  if (i < questions.value.length) {
    const question = questions.value[i];
    if (question && question.content) {
      lyrics.value = question.content.lyrics;
      title.value = question.title;
      if(props.id_category == 1){
        artist.value = question.content.song_author + ' - ' + question.content.song_title;
      } else {
        const audioPlayer = document.querySelector('audio');
        audioPlayer.src = question.content.sound_url;
        togglePlay();
      }
      propositions = question.content.answers;
    } else {
      console.error("La structure des données de la question est incorrecte ou incomplète.");
    }
  }
}

function nextQuestion() {
  if (i < questions.value.length - 1) {
    i++;
    isFinished.value = false;
    buttonValue.value = 'Valider';
    resetInputValue()
    getQuestions();
    resetTimeLimit();
  } else {
    router.push('/result');
  }
}

const resetTimeLimit = () => {
  if (CompteurComponent.value) {
    CompteurComponent.value.timeLimit = 20;
    CompteurComponent.value.timePassed = 0;
    CompteurComponent.value.startCountdown();
  }
};

const togglePlay = () => {
  const audio = document.querySelector('audio');
  if (audio.paused) {
    audio.play();
    isPlaying.value = true;

  } else {
    audio.pause();
    isPlaying.value = false;
  }
};

const handleCounterZero = () => {
  isFinished.value = true;
};

function selectProposition(proposition) {
  selectedProposition.value = proposition;
}

function handleValidation() {
  if (i >= 0) {
    const answer = questions.value[i].answer.toLowerCase();
    const answerWords = answer.split(/\s+/);
    const point = questions.value[i].points;

    const songAuthor = questions.value[i].content.song_author;
    const songTitle = questions.value[i].content.song_title;

    if(props.id_category == 1 ){
      inputWords = inputValue.value.trim().toLowerCase().split(/\s+/);
    } else{
      inputWords = selectedProposition.value.trim().toLowerCase().split(/\s+/);
    }

    isValid.value = inputWords.every((inputWord, index) => {
      const answerWord = answerWords[index];
      if (Math.abs(inputWord.length - answerWord.length) > 1) {
        return false;
      }
      if (Math.abs(inputWord.length - answerWord.length) === 1) {
        const longerWord = inputWord.length > answerWord.length ? inputWord : answerWord;
        const shorterWord = inputWord.length < answerWord.length ? inputWord : answerWord;
        let shorterIndex = 0;
        let longerIndex = 0;
        let diffCount = 0;

        while (shorterIndex < shorterWord.length && longerIndex < longerWord.length) {
          if (shorterWord[shorterIndex] !== longerWord[longerIndex]) {
            diffCount++;
            longerIndex++;
          } else {
            shorterIndex++;
            longerIndex++;
          }
        }

        if (diffCount > 1) {
          return false;
        }
      }
      if (inputWord.length === answerWord.length) {
        return inputWord === answerWord;
      }
      const shorterWord = inputWord.length < answerWord.length ? inputWord : answerWord;
      const longerWord = inputWord.length > answerWord.length ? inputWord : answerWord;
      return shorterWord.split('').every((char, index) => {
        return char === longerWord[index] || char === longerWord[index + 1];
      });
    });

    if (isValid.value) {
      showNotification.value = true;
      points.push({
        result: point,
        max: point
      });
    } else {
      showNotification.value = true;
      points.push({
        result: 0,
        max: point
      });
      correctAnswer.value = answer;
    }

    setTimeout(() => {
      showNotification.value = false;
    }, 3000);

    answers.push({
      input: selectedProposition.value || inputValue.value,
      answer: answer,
      author: songAuthor,
      title: songTitle
    });

    saveAnswers(answers);
    savePoints(points);
    saveCategoryId(props.id_category);
  } else {
    console.log('La validation ne se fait que lorsque i est égal à 0.');
  }
}

onMounted(() => {
  fetchQuestions();
});
</script>

<style>
  .body {
    background-color: #F2EAFA;
    position: relative;
  }

  .body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 1000px;
    height: 50vh;
    background-color: #241A39;
    border-radius: 0 0 50px 50px;
    background-image: url('../assets/Images/notes-left.png'), url('../assets/Images/notes-right.png');
    background-position: left, right;
    background-size: 350px auto, 350px auto;
    background-repeat: no-repeat, no-repeat;
  }

  .home-view {
    position: relative;
    flex-direction: column;
    min-height: 100vh;
  }

  .title {
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: white;
    font-size: 26px;
  }

  .subtitle {
    color: #F9D4FA;
    font-size: 24px;
  }

  .lyrics {
    color: #241A39;
    font-weight: 700;
  }

  .compteur-container {
    margin-top: 20px;
    display: flex;
  }

  .centered-rectangle {
    position: relative;
    width: 80%;
    max-width: 600px;
    min-height: 150px;
    overflow: auto;
    background-color: #F4F1F6;
    box-shadow: 0px 0px 20px #D4C3DF;
    border-radius: 50px;
    margin: 20px auto;
  }

  .inner-rectangle {
    padding: 20px;
  }

  .right {
    right: 0;
    transform: translate(50%, -50%) scaleX(-1);
    background-image: url('../assets/Images/notes.png');
  }

  .bottom-section {
    flex-direction: column;
    margin-top: 20px;
  }

  .bottom-section > * {
    margin-bottom: 10px;
  }

  .centered-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  audio {
  display: block;
  width: 100%;
  height: auto;
}

.audio_img {
  width: 50px;
  height: 50px;
  margin-left: 10px;
  fill: white;
}
.containers{
display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
.containers_div {
  margin-left: 50px;
    margin-top: 20px;
    width: 40%;
    height: 50px;
    height: 50px;
    border-radius: 100px;
    background-image: linear-gradient(to right, #ff66c4, #ffde59);
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .containers_btn {
    width: 90%;
    background-color: white;
    padding: 10px;
    font-size: 16px;
    color: #241a39;
    border-radius: 100px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .containers_btn:not(:disabled):hover {
    background-color: #241a39;
    color: white;
  }

  .containers_btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0);
    color:white;
  }
</style>
