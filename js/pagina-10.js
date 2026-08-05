const questions = document.querySelectorAll(".faq-question");

questions.forEach(question => {
    question.addEventListener("click", () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.classList.contains("active");

        document.querySelectorAll(".faq-answer").forEach(item => {
            item.classList.remove("active");
        });

        document.querySelectorAll(".faq-question").forEach(item => {
            item.classList.remove("active");
            item.querySelector("span").textContent = "+";
        });

        // Abrir la seleccionada
        if (!isOpen) {
            answer.classList.add("active");
            question.classList.add("active");
            question.querySelector("span").textContent = "x";
        }
    });
});