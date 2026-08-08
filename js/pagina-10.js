document.addEventListener("DOMContentLoaded", () => {
    const questions = document.querySelectorAll(".faq-question");
    console.log("Preguntas encontradas:", questions.length);

    questions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains("active");

            // Cerrar todas
            document.querySelectorAll(".faq-answer").forEach(item => {
                item.classList.remove("active");
            });

            document.querySelectorAll(".faq-question").forEach(item => {
                item.querySelector("span").textContent = "+";
            });

            if (!isOpen) {
                answer.classList.add("active");
                question.querySelector("span").textContent = "×";
            }
        });
    });
});