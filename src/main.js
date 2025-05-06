const program = {
  1: {
    percentages: [40, 50, 60, 65, 75, 85],
    reps: ["5", "5", "3", "5", "5", "5+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  2: {
    percentages: [40, 50, 60, 70, 80, 90],
    reps: ["5", "5", "3", "3", "3", "3+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  3: {
    percentages: [40, 50, 60, 75, 85, 95],
    reps: ["5", "5", "3", "5", "3", "1+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  4: {
    percentages: [40, 50, 60, 65, 75, 85],
    reps: ["5", "5", "3", "5", "5", "5+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  5: {
    percentages: [40, 50, 60, 70, 80, 90],
    reps: ["5", "5", "3", "3", "3", "3+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  6: {
    percentages: [40, 50, 60, 75, 85, 95],
    reps: ["5", "5", "3", "5", "3", "1+"],
    rests: [90, 90, 150, 150, 180, 0]
  },
  7: {
    percentages: [40, 50, 60],
    reps: ["5", "5", "5"],
    rests: [150, 150, 150]
  }
};

let currentTimer = null;

function startTimer(duration, display, timerDisplay) {
  let timer = duration, minutes, seconds;
  currentTimer = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(currentTimer);
      display.textContent = "휴식 종료";
      timerDisplay.classList.remove('bg-green-500', 'text-white');
      timerDisplay.classList.add('bg-white', 'text-red-500');
    }
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  const calculateButton = document.getElementById('calculate');
  const resultsSection = document.getElementById('results');
  
  calculateButton.addEventListener('click', () => {
    const weight = parseFloat(document.getElementById('weight').value);
    const week = parseInt(document.getElementById('week').value);
    
    if (isNaN(weight) || isNaN(week)) {
      alert('올바른 값을 입력해주세요.');
      return;
    }
    
    const currentProgram = program[week];
    const sets = currentProgram.percentages.map((percentage, index) => {
      const calculatedWeight = Math.floor(weight * percentage / 100 / 5) * 5;
      // const calculatedWeight = weight * percentage / 100;
      return {
        weight: calculatedWeight,
        reps: currentProgram.reps[index],
        rest: currentProgram.rests[index]
      };
    });
    
    // Display results
    resultsSection.innerHTML = `
      <h2 class="text-xl font-semibold text-gray-800 mb-4 mt-4">${week}주차 프로그램</h2>
      <div class="space-y-2">
        <table class="w-full">
          <thead>
            <tr class="text-sm text-gray-500 font-semibold">
              <th class="w-10"></th>
              <th class="text-center w-10">세트</th>
              <th class="text-center">무게</th>
              <th class="text-center">횟수</th>
            </tr>
          </thead>
          <tbody>
            ${sets.map((set, index) => `
              <tr class="border-b border-gray-200">
                <td class="py-2">
                  <input type="checkbox" id="set-${index}" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                </td>
                <td class="text-center font-medium text-gray-800">${index + 1}</td>
                <td class="text-center font-medium text-gray-800">${set.weight}</td>
                <td class="text-center font-medium text-gray-800">${set.reps}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="timer" class="mt-4 text-center text-lg font-medium text-white bg-green-500 rounded-lg py-2 h-10 hidden flex items-center justify-center">
          <span id="time">00:00</span>
        </div>
      </div>
    `;

    // Add event listeners to checkboxes
    sets.forEach((set, index) => {
      const checkbox = document.getElementById(`set-${index}`);
      const row = checkbox.closest('tr');
      const timerDisplay = document.getElementById('timer');
      const timeDisplay = document.getElementById('time');
      
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          row.classList.add('line-through', 'text-gray-800');
          
          // Clear any existing timer
          if (currentTimer) {
            clearInterval(currentTimer);
          }
          
          // Reset timer display
          timerDisplay.classList.remove('hidden');
          const minutes = Math.floor(set.rest / 60);
          const seconds = set.rest % 60;
          timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          timerDisplay.classList.remove('bg-white', 'text-red-500');
          timerDisplay.classList.add('bg-green-500', 'text-white');
          
          // Start new timer
          startTimer(set.rest, timeDisplay, timerDisplay);

          // Scroll to timer
          timerDisplay.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          row.classList.remove('line-through', 'text-gray-800');
          
          // Clear timer
          if (currentTimer) {
            clearInterval(currentTimer);
          }
          timerDisplay.classList.add('hidden');
        }
      });
    });
  });
});


const barbellSelect = document.getElementById('barbell');
  const plateInputs = ['45', '35', '25', '15', '10', '5', '2_5'].map(size => 
      document.getElementById(`plate-${size}`)
  );
  const totalWeightDisplay = document.getElementById('total-weight');

  function calculateTotalWeight() {
      const barbellWeight = parseFloat(barbellSelect.value);
      const plateWeights = plateInputs.map((input, index) => {
          const count = parseInt(input.value) || 0;
          const weight = [45, 35, 25, 15, 10, 5, 2.5][index];
          return count * weight * 2; // Multiply by 2 for both sides
      });
      
      const totalWeight = barbellWeight + plateWeights.reduce((sum, weight) => sum + weight, 0);
      totalWeightDisplay.textContent = `${totalWeight} lb`;
  }

  barbellSelect.addEventListener('change', calculateTotalWeight);
  plateInputs.forEach(input => {
      input.addEventListener('input', calculateTotalWeight);
  });

  // Calculate initial total weight
  calculateTotalWeight();

  // Add increment/decrement functionality
  document.querySelectorAll('.plate-increment').forEach(button => {
      button.addEventListener('click', () => {
          const plateId = button.getAttribute('data-plate');
          const input = document.getElementById(`plate-${plateId}`);
          const currentValue = parseInt(input.value) || 0;
          if (currentValue < 10) {
              input.value = currentValue + 1;
              calculateTotalWeight();
          }
      });
  });

  document.querySelectorAll('.plate-decrement').forEach(button => {
      button.addEventListener('click', () => {
          const plateId = button.getAttribute('data-plate');
          const input = document.getElementById(`plate-${plateId}`);
          const currentValue = parseInt(input.value) || 0;
          if (currentValue > 0) {
              input.value = currentValue - 1;
              calculateTotalWeight();
          }
      });
  });

  // Add reset functionality
  const resetButton = document.getElementById('reset-plates');
  resetButton.addEventListener('click', () => {
      // Reset barbell to default (men's barbell)
      barbellSelect.value = '45';
      
      // Reset all plate inputs to 0
      plateInputs.forEach(input => {
          input.value = '0';
      });
      
      // Recalculate total weight
      calculateTotalWeight();
  });
