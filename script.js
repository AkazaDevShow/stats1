document.addEventListener('DOMContentLoaded', function () {
  const printButton = document.getElementById('printButton');
  const listArea = document.getElementById('listArea');

  if (printButton) {
    printButton.addEventListener('click', () => {
      const select1 = document.getElementById('select1').value;
      const select2 = document.getElementById('select2').value;
      const select3 = document.getElementById('select3').value;
      const select4 = document.getElementById('select4').value;
      const select5 = document.getElementById('select5').value;

      const now = new Date();
      const time = now.toLocaleTimeString();
      const day = now.toLocaleDateString(undefined, { weekday: 'long' });

      const item = document.createElement('div');
      item.innerHTML = `
        <div>Select1: ${select1}, Select2: ${select2}</div>
        <div style="font-size: 12px; opacity: 0.6;">${day}, ${time}</div>
        <hr>
      `;
      listArea.appendChild(item);
    });
  }
});
