<!-- <template>
  <div class="body">
    <div class="home-view centered-content">
      <h1 class="title">{{ title }}</h1>
      <div>
        <ul>
          <li>
            <div v-if="i !== -1" class="compteur-container">
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
                <p v-if="id_category == 1 "  v-html="formatLyrics()"></p>
              </div>
            </div>

            <ul v-if="id_category == 2">
              <li v-for="answer in answers">
                <button :disabled="isFinished">{{ answer }}</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="bottom-section centered-content">
        <Input :disabled="isFinished" @input-value-changed="updateInputValue" v-if="id_category == 1 &&  i !== -1 " />

        <ValideButton :buttonValue="buttonValue" @validate="handleValidation" @click="nextQuestion"></ValideButton>
      </div>
      <div v-if="id_category == 2 ">
        <audio ref="audioPlayer" controls></audio>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';
import Compteur from '../components/Compteur.vue';
import Input from '../components/Input.vue';
import ValideButton from '../design-system/button.vue';

const props = defineProps(['id_category']);
const questions = ref([]);
const inputValue = ref('');
const lyrics = ref('');
const title = ref('');
const artist = ref('');
let answers = [];
let i = -1;
const buttonValue = ref('Lancer le jeu');
const isFinished = ref(false);
const CompteurComponent = ref();
const isPlaying = ref(false);

const fetchQuestions = async () => {
  try {
    const response = await axios.get(`https://quizz-musical-backend.airdev.be/api/categories/${props.id_category}`);
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

const getQuestions = () => {
  if (i < questions.value.length) {
    lyrics.value = questions.value[i].content.lyrics;
    title.value = questions.value[i].title;
    if (props.id_category == 1) {
      artist.value = questions.value[i].content.song_author + ' - ' + questions.value[i].content.song_title;
    } else {
      const audioPlayer = document.querySelector('audio');
      audioPlayer.src = questions.value[i].content.sound_url;
      togglePlay();
    }
    answers = questions.value[i].content.answers;
  }
};

const nextQuestion = () => {
  if (i < questions.value.length - 1) {
    i++;
    buttonValue.value = 'Valider';
    getQuestions();
    resetTimeLimit();
    isFinished.value = false;
  } else {
    isFinished.value = true;
    buttonValue.value = 'Terminer';
  }
};

const resetTimeLimit = () => {
  if (CompteurComponent.value) {
    CompteurComponent.value.timeLimit = 20;
    CompteurComponent.value.timePassed = 0;
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

.bottom-section {
  flex-direction: column;
  margin-top: 20px;
}

.bottom-section > * {
  margin-bottom: 10px;
}

.centered-content {
  display: flex;
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
</style>
../components/button.vue -->