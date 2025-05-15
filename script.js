document.addEventListener('DOMContentLoaded', function () {
  const list2Data = JSON.parse(localStorage.getItem('myList2')) || [];
  const list1Data = JSON.parse(localStorage.getItem('myList')) || [];
  const accessMode = localStorage.getItem('accessMode') || 'view';
  const listArea = document.getElementById('listArea');
  const entriesArea = document.getElementById('entries');

  // Handle "list2" (feedback log)
  if (listArea) {
    renderFeedbackList(list2Data);

    const printButton = document.getElementById('printButton');
    if (printButton) {
      printButton.addEventListener('click', () => {
        const select1 = document.getElementById('select1').value;

        const now = new Date();
        const time = now.toLocaleTimeString();
        const day = now.toLocaleDateString(undefined, { weekday: 'long' });

        const newEntry = {
          select1,
          time,
          day
        };

        list2Data.push(newEntry);
        localStorage.setItem('myList2', JSON.stringify(list2Data));
        renderFeedbackList(list2Data);
      });
    }
  }

  // Handle "list1" (daily checklist with edit buttons)
  if (entriesArea) {
    if (accessMode === 'view') {
      const addBtn = document.getElementById('addButton');
      if (addBtn) addBtn.style.display = 'none';
    }
    renderChecklist(list1Data);
  }

  // Optional Clear Button
  const clearBtn = document.getElementById('clearData');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('myList');
      localStorage.removeItem('myList2');
      alert("تم مسح البيانات.");
      location.reload();
    });
  }

  // Functions
  function renderFeedbackList(data) {
    listArea.innerHTML = '';
    data.forEach(item => {
      const entry = document.createElement('div');
      entry.innerHTML = `
        <div>كم وقت لعبت: ${item.select1}</div>
        <div style="font-size: 12px; opacity: 0.6;">${item.day}, ${item.time}</div>
        <hr>
      `;
      listArea.appendChild(entry);
    });
  }

  function renderChecklist(items) {
    entriesArea.innerHTML = '';
    const options = ['نعم', 'لا'];

    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'entry';

      div.innerHTML = `
        <div>
          ${renderField('صلاة الصبح', 'select1', item.select1, index)}
          ${renderField('صلاة الظهر و العصر', 'select2', item.select2, index)}
          ${renderField('صلاة المغرب و العشاء', 'select3', item.select3, index)}
          ${renderField('قراءة القران الكريم', 'select4', item.select4, index)}
          ${renderField('احتياط', 'select5', item.select5, index)}
          <small>${item.day}, ${item.time}</small>
        </div>
      `;

      entriesArea.appendChild(div);

      ['select1', 'select2', 'select3', 'select4', 'select5'].forEach(field => {
        const editBtn = document.getElementById(`edit-btn-${field}-${index}`);
        const saveBtn = document.getElementById(`save-btn-${field}-${index}`);
        const cancelBtn = document.getElementById(`cancel-btn-${field}-${index}`);
        const displaySpan = document.getElementById(`display-${field}-${index}`);
        const editSelect = document.getElementById(`edit-select-${field}-${index}`);

        if (accessMode === 'view') {
          editBtn.style.display = 'none';
          saveBtn.style.display = 'none';
          cancelBtn.style.display = 'none';
        } else {
          editBtn.onclick = () => {
            displaySpan.style.display = 'none';
            editSelect.style.display = 'inline-block';
            editBtn.style.display = 'none';
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
          };

          saveBtn.onclick = () => {
            const newValue = editSelect.value;
            items[index][field] = newValue;
            localStorage.setItem('myList', JSON.stringify(items));
            renderChecklist(items);
          };

          cancelBtn.onclick = () => {
            renderChecklist(items);
          };
        }
      });
    });

    function renderField(label, fieldName, value, index) {
      return `
        <p>
          <span class="field-label">${label}:</span>
          <span id="display-${fieldName}-${index}">${value}</span>
          <select id="edit-select-${fieldName}-${index}" style="display:none;">
            ${options.map(opt => `<option value="${opt}" ${opt === value ? 'selected' : ''}>${opt}</option>`).join('')}
          </select>

          <button class="edit-btn" id="edit-btn-${fieldName}-${index}">تعديل</button>
          <button class="save-btn" id="save-btn-${fieldName}-${index}" style="display:none;">حفظ</button>
          <button class="cancel-btn" id="cancel-btn-${fieldName}-${index}" style="display:none;">إلغاء</button>
        </p>
      `;
    }
  }
});
