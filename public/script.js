document.addEventListener('DOMContentLoaded', function () {
    const gradetbody = document.getElementById('gradetbody');
    const gpaResult = document.getElementById('gpaResult');
    const addRowButton = document.getElementById('addRow');
    const calculateGPAButton = document.getElementById('calculateGPA');

    const gradeValues = {
        'A': 4.0,
        'B+': 3.5,
        'B': 3.0,
        'C+': 2.5,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0
    };

    let courseCounter = 2;

    async function fetchGrades() {
        const response = await axios.get('/grades');
        return response.data;
    }

    async function saveGrade(grade) {
        try {
            await axios.post('/grades', grade);
        } catch (error) {
            console.error('Error saving grade:', error)
        }
    
    }

    async function deleteGrade(id) {
        await axios.delete(`/grades/${id}`);
    }

    async function loadGrades() {
        const grades = await fetchGrades();
        gradetbody.innerHTML = '';
        grades.forEach(grade => {
            const newRow = document.createElement('tr');
            newRow.dataset.id = grade._id;
            newRow.innerHTML = `
                <td><input type="text" name="course" value="${grade.course}" placeholder="Course #${courseCounter++}"></td>
                <td><input type="text" name="grade" value="${grade.grade}" placeholder="Letter Grade"></td>
                <td><input type="number" name="credits" value="${grade.credits}" placeholder="Credit Hours"></td>
                <td><button type="button" class="remove-row">x</button></td>
            `;
            gradetbody.appendChild(newRow);

            newRow.querySelector('.remove-row').addEventListener('click', async function () {
                await deleteGrade(grade._id);
                newRow.remove();
            });
        });
    }

    addRowButton.addEventListener('click', function () {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" name="course" placeholder="Course #${courseCounter++}"></td>
            <td><input type="text" name="grade" placeholder="Letter Grade"></td>
            <td><input type="number" name="credits" placeholder="Credit Hours"></td>
            <td><button type="button" class="remove-row">x</button></td>
        `;
        gradetbody.appendChild(newRow);

        newRow.querySelector('.remove-row').addEventListener('click', function () {
            newRow.remove();
        });
    });

    calculateGPAButton.addEventListener('click', async function () {
        let totalCredits = 0;
        let totalGradePoints = 0;

        const rows = gradetbody.querySelectorAll('tr');
        rows.forEach(row => {
            const grade = row.querySelector('input[name="grade"]').value.toUpperCase(); // Convert to uppercase
            const credits = parseFloat(row.querySelector('input[name="credits"]').value);

            if (grade in gradeValues && !isNaN(credits)) {
                totalCredits += credits;
                totalGradePoints += gradeValues[grade] * credits;
            }
        });

        const gpa = totalGradePoints / totalCredits;
        gpaResult.textContent = totalCredits > 0 ? gpa.toFixed(2) : 'N/A';

        // Save grades to the database
        rows.forEach(async row => {
            const course = row.querySelector('input[name="course"]').value;
            const grade = row.querySelector('input[name="grade"]').value.toUpperCase(); // Convert to uppercase
            const credits = parseFloat(row.querySelector('input[name="credits"]').value);

            if (course && grade in gradeValues && !isNaN(credits)) {
                await saveGrade({ course, grade, credits });
            }
        });
    });

    // Initial load of grades from the database
    loadGrades();
});
