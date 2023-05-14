import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const initialState = {
  points: 0,
  coins: 0,
  behaviorData: [
    [
      { text: 'תפילה', checked: false },
      { text: 'תפילה', checked: false },
      { text: 'תפילה', checked: false },
      { text: 'תפילה', checked: false },
      { text: 'תפילה', checked: false },
      { text: 'תפילה', checked: false }
    ],
    [
      { text: 'תורה', checked: false },
      { text: 'תורה', checked: false },
      { text: 'תורה', checked: false },
      { text: 'תורה', checked: false },
      { text: 'תורה', checked: false },
      { text: 'תורה', checked: false }
    ],
    [
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false }
    ],
    [
      { text: 'משנה', checked: false },
      { text: 'התעמלות', checked: false },
      { text: 'משנה', checked: false },
      { text: 'משנה', checked: false },
      { text: 'משנה', checked: false },
      { text: 'משנה', checked: false }
    ],
    [
      { text: 'חשבון', checked: false },
      { text: 'נביא', checked: false },
      { text: 'נביא', checked: false },
      { text: 'משנה', checked: false },
      { text: 'משנה', checked: false },
      { text: 'קבלת שבת', checked: false }
    ],
    [
      { text: 'הפסקה', checked: false },
      { text: 'הפסקה', checked: false },
      { text: 'הפסקה', checked: false },
      { text: 'הפסקה', checked: false },
      { text: 'הפסקה', checked: false },
      { text: 'הפסקה', checked: false }
    ],
    [
      { text: 'עברית', checked: false },
      { text: 'עברית', checked: false },
      { text: 'חשבון', checked: false },
      { text: 'עברית', checked: false },
      { text: 'נביא', checked: false }
    ],
    [
      { text: 'מוזיקה', checked: false },
      { text: 'חשבון', checked: false },
      { text: 'עברית', checked: false },
      { text: 'טבע', checked: false },
      { text: 'נביא', checked: false }
    ],
    [
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: '', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
      { text: 'אוכל + הפסקה', checked: false },
    ],
    [
      { text: 'גדולי האומה', checked: false },
      { text: 'אומנות', checked: false },
      { text: '', checked: false },
      { text: 'גאומטריה', checked: false },
      { text: 'חינוך', checked: false }
    ],
    // Add more rows here as needed
  ]
};

const App = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [points, setPoints] = useState(initialState.points);
  const [coins, setCoins] = useState(initialState.coins);
  const [behaviorData, setBehaviorData] = useState(initialState.behaviorData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);
  const [checkedOptions, setCheckedOptions] = useState([]);

  useEffect(() => {
    if (points > 100) {
      setPoints(points - 100);
      setCoins(coins + 1);
    }
  }, [points, coins]);

  useEffect(() => {
    const storedData = getStoredData();
    const currentWeek = getWeekNumber();

    if (storedData) {
      setBehaviorData(storedData.behaviorData);
      setPoints(storedData.points);
      setCoins(storedData.coins);
      
      if (storedData.weekNumber !== currentWeek) {
        resetCheckedState();
      }
    }
  }, []);

  const resetCheckedState = () => {
    const newData = behaviorData.map((row) =>
      row.map((cell) => ({ ...cell, checked: false }))
    );
    setBehaviorData(newData);
    storeData(newData);
  };
  
  useEffect(() => {
    const dataToStore = {
      behaviorData,
      points,
      coins
    };
    storeData(dataToStore);
  }, [behaviorData, points, coins]);

  const handleCheckboxChange = (index) => {
    const updatedOptions = [...checkedOptions];
    if (updatedOptions.includes(index)) {
      updatedOptions.splice(updatedOptions.indexOf(index), 1);
    } else {
      updatedOptions.push(index);
    }
    setCheckedOptions(updatedOptions);
  };

  const handleSave = () => {
    const newData = [...behaviorData];
    newData[selectedRow][selectedCol].checked = checkedOptions.length > 0;

    setBehaviorData(newData);

    let pointsToAdd = checkedOptions.length;
    setPoints(points + pointsToAdd);

    closeModal();
  };

  const openModal = (row, col) => {
    if (behaviorData[row][col].checked || !behaviorData[row][col].text) {
      return;
    }
    setSelectedRow(row);
    setSelectedCol(col);
    setCheckedOptions(behaviorData[row][col].checked ? [1] : []);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedRow(null);
    setSelectedCol(null);
    setCheckedOptions([]);
  };

  const weekDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

  function storeData(data) {
    if (data.points === 0 && data.coins === 0) {
      return;
    }
    const currentWeek = getWeekNumber();
    const storedData = { ...data, weekNumber: currentWeek };
    localStorage.setItem('behaviorData', JSON.stringify(storedData));
  }

  const getWeekNumber = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const daysOffset = firstDayOfYear.getDay() === 0 ? 1 : 8 - firstDayOfYear.getDay();
    const firstWeekStartDate = new Date(today.getFullYear(), 0, daysOffset);
    const weekNumber = Math.floor((today - firstWeekStartDate) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber;
  };
  
  function getStoredData() {
    const data = localStorage.getItem('behaviorData');
    return data ? JSON.parse(data) : null;
  }

  return (
    <div className="App" dir="rtl">
      <h1>טבלת התנהגות אלקנה התותח</h1>
      <div className="Points">נקודות: {points}/100</div>
      <div className="Points">מטבעות: {coins}/10</div>
      <table className="Table">
        <thead>
          <tr>
            {weekDays.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {behaviorData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((behavior, colIndex) => (
                <td
                  key={colIndex}
                  className={behavior.checked ? 'Checked' : ''}
                  onClick={() => openModal(rowIndex, colIndex)}
                >
                  {behavior.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Behavior Modal"
      >
        {behaviorData[selectedRow]?.[selectedCol] && (
      <div dir="rtl" className="Modal">
        <h2>{behaviorData[selectedRow][selectedCol].text}</h2>
        <br />
        <label>
          <input
            type="checkbox"
            checked={checkedOptions.includes(0)}
            onChange={() => handleCheckboxChange(0)}
          />
          התנהגתי יפה בשיעור
        </label>
        <label>
          <input
            type="checkbox"
            checked={checkedOptions.includes(1)}
            onChange={() => handleCheckboxChange(1)}
          />
          שיחקתי יפה עם החברים
        </label>
        <label>
          <input
            type="checkbox"
            checked={checkedOptions.includes(2)}
            onChange={() => handleCheckboxChange(2)}
          />
          לא הרבצתי, לא קיללתי ולא איימתי על אף אחד
        </label>
        <label>
          <input
            type="checkbox"
            checked={checkedOptions.includes(3)}
            onChange={() => handleCheckboxChange(3)}
          />
          שלטתי בכעס שלי
        </label>
        <label>
          <input
            type="checkbox"
            checked={checkedOptions.includes(4)}
            onChange={() => handleCheckboxChange(4)}
          />
         לא נתתי לילדים אחרים לגרור אותי
        </label>
        <button onClick={handleSave}>שמור</button>
        <button onClick={closeModal}>ביטול</button>
      </div>
      )}
    </Modal>
  </div>
  );
};

export default App;