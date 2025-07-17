export default function scrollTo(id) {

    if (id) {
        setTimeout(() => {
            var my_element = document.getElementById(id);
            my_element.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });

        }, 50)

    } else {
        return 
    }



}


// export default function scrollTo(id) {

//     if (id) {
//         setTimeout(() => {
//             var my_element = document.getElementById(id);
//             my_element.classList.add("scroll-margin-top"); // Adiciona a classe CSS

//             my_element.scrollIntoView({
//                 behavior: "smooth",
//                 block: "start",
//                 inline: "nearest"
//             });

//             setTimeout(() => {
//                 my_element.classList.remove("scroll-margin-top"); // Remove a classe CSS após o scroll
//             }, 1000); // Tempo para remover a classe CSS após o scroll

//         }, 50)

//     } else {
//         return 
//     }
// }