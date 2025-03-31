import { Schedule } from "./schedule"

const scheduler = new Schedule()

const button = document.getElementById('button');
const content = document.getElementById('content');

function createElements(total: number, batchSize = 100) {
  let created = 0;

  function createBatch() {
    const fragment = document.createDocumentFragment();
    const end = Math.min(created + batchSize, total);

    for (let i = created; i < end; i++) {
      const element = document.createElement('div');
      element.className = 'item';
      element.textContent = i.toString();
      fragment.appendChild(element);
    }

    content.appendChild(fragment);
    created = end;
    if (created < total) {
      return createBatch;
    }
    return null;
  }

  scheduler.schedule(createBatch);
}

button.addEventListener('click', () => {
  createElements(500000);
});