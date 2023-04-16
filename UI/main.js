const result = localStorage.getItem('result');
const error = localStorage.getItem('error');
if (result === 'false') {
  // 경고창 보여주기
  document.getElementById('alert-div').classList.remove('d-none');
  localStorage.removeItem('result');
} else {
  // 로그인 성공, 메인 페이지로 이동
  window.location.href = '/';
}