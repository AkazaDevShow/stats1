document.addEventListener('DOMContentLoaded', function () {
  // Load saved data or default
  let list2Data = JSON.parse(localStorage.getItem('myList2')) || [];
  let list1Data = JSON.parse(localStorage.getItem('myList')) || [];
  const accessMode = localStorage.getItem('accessMode') || 'view';

  const listArea = document.getElementById('listArea');
  const entriesArea = document.getElementById('entries');

  // Render initial UI
  if (listArea) renderFeedbackList(list2Data);
  if (entriesArea) {
    if (accessMode === 'view') {
      const addBtn = document.getElementById('addButton');
      if (addBtn) addBtn.style.display = 'none';
    }
    renderChecklist(list1Data);
  }

  // Setup print button for feedback log
  const printButton = document.getElementById('printButton');
  if (printButton) {
    printButton.addEventListener('click', () => {
      const select1 = document.getElementById('select1').value;

      const now = new Date();
      const time = now.toLocaleTimeString();
      const day = now.toLocaleDateString(undefined, { weekday: 'long' });

      const newEntry = { select1, time, day };
      list2Data.push(newEntry);
      localStorage.setItem('myList2', JSON.stringify(list2Data));
      console.log('Saved myList2:', list2Data);
      renderFeedbackList(list2Data);
    });
  }

  // Setup clear button to clear all data
  const clearBtn = document.getElementById('clearData');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('myList');
      localStorage.removeItem('myList2');
      alert("تم مسح البيانات.");
      location.reload();
    });
  }

  // Event delegation for checklist buttons (edit, save, cancel)
  if (entriesArea) {
    entriesArea.addEventListener('click', (e) => {
      if (accessMode === 'view') return; // no edits allowed in view mode

      // Extract info from button id
      const target = e.target;
      if (!target.id) return;

      // Pattern: action-btn-field-index e.g. edit-btn-select1-0
      const match = target.id.match(/^(edit|save|cancel)-btn-(select[1-5])-(\d+)$/);
      if (!match) return;

      const [_, action, field, indexStr] = match;
      const index = parseInt(indexStr, 10);

      // Find related elements by id
      const displaySpan = document.getElementById(`display-${field}-${index}`);
      const editSelect = document.getElementById(`edit-select-${field}-${index}`);
      const editBtn = document.getElementById(`edit-btn-${field}-${index}`);
      const saveBtn = document.getElementById(`save-btn-${field}-${index}`);
      const cancelBtn = document.getElementById(`cancel-btn-${field}-${index}`);

      if (!displaySpan || !editSelect || !editBtn || !saveBtn || !cancelBtn) return;

      if (action === 'edit') {
        displaySpan.style.display = 'none';
        editSelect.style.display = 'inline-block';
        editBtn.style.display = 'none';
        saveBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
      } else if (action === 'save') {
        const newValue = editSelect.value;
        list1Data[index][field] = newValue;
        localStorage.setItem('myList', JSON.stringify(list1Data));
        console.log('Saved myList:', list1Data);
        renderChecklist(list1Data);
      } else if (action === 'cancel') {
        renderChecklist(list1Data);
      }
    });
  }

  // Render feedback list (list2Data)
  function renderFeedbackList(data) {
    if (!listArea) return;
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

  // Render checklist with edit buttons (list1Data)
  function renderChecklist(items) {
    if (!entriesArea) return;
    entriesArea.innerHTML = '';
    const options = ['نعم', 'لا'];

    items.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'entry';

      // Build the HTML for the entry fields with buttons
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

      // Hide buttons if in view mode
      if (accessMode === 'view') {
        ['select1', 'select2', 'select3', 'select4', 'select5'].forEach(field => {
          const editBtn = document.getElementById(`edit-btn-${field}-${index}`);
          const saveBtn = document.getElementById(`save-btn-${field}-${index}`);
          const cancelBtn = document.getElementById(`cancel-btn-${field}-${index}`);

          if (editBtn) editBtn.style.display = 'none';
          if (saveBtn) saveBtn.style.display = 'none';
          if (cancelBtn) cancelBtn.style.display = 'none';
        });
      }
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
