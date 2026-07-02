document.getElementById('year').textContent = new Date().getFullYear();

const estimateForm = document.getElementById('estimateForm');
const formStatus = document.getElementById('formStatus');

if (estimateForm) {
  estimateForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const data = new FormData(estimateForm);
    const photoInput = estimateForm.querySelector('input[type="file"]');
    const photoCount = photoInput && photoInput.files ? photoInput.files.length : 0;

    const subject = encodeURIComponent('New Estimate Request - Grizzly General Contracting');
    const body = encodeURIComponent(
      `New Estimate Request\n\n` +
      `Name: ${data.get('name') || ''}\n` +
      `Phone: ${data.get('phone') || ''}\n` +
      `Email: ${data.get('email') || ''}\n` +
      `Project Address / Town: ${data.get('address') || ''}\n` +
      `Project Type: ${data.get('service') || ''}\n` +
      `Desired Timeline: ${data.get('timeline') || ''}\n\n` +
      `Project Details:\n${data.get('message') || ''}\n\n` +
      (photoCount > 0 ? `Photos selected: ${photoCount}. Please attach them to this email before sending.\n` : '')
    );

    window.location.href = `mailto:jacob@grizzlygeneralcontracting.com?subject=${subject}&body=${body}`;

    formStatus.textContent = 'Your email app should open with the request filled out. Send it to complete your estimate request. We will follow up within one business day.';
  });
}
