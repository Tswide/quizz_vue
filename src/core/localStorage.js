
export function saveAnswers(answers) {
  localStorage.setItem('answers', JSON.stringify(answers));
}

export function savePoints(points) {
  localStorage.setItem('points', JSON.stringify(points));
}

export function saveCategoryId(id_category) {
  localStorage.setItem('id_category', id_category);
}

export function getCategoryId() {
  return localStorage.getItem('id_category');
}

export function getAnswers() {
  const storedAnswers = localStorage.getItem('answers');
  return storedAnswers ? JSON.parse(storedAnswers) : [];
}

export function getPoints() {
  const storedPoints = localStorage.getItem('points');
  return storedPoints ? JSON.parse(storedPoints) : [];
}
