function updateClock(): void {
  const timeElement = document.getElementById('os-clock-time');
  const dateElement = document.getElementById('os-clock-date');
  if (timeElement && dateElement) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : String(minutes);

    const date = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

    timeElement.textContent = hours12 + ':' + minutesStr + ' ' + ampm;
    dateElement.textContent = date;
  }
}

setInterval(updateClock, 1000);
updateClock();

export {};
