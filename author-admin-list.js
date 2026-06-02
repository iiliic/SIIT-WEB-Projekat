var items = document.querySelectorAll(".item");

    function handleClick(event) {
      var clickedItem = event.currentTarget;

      removeSelection();

      clickedItem.classList.add("selected");
      console.log("selection added" + clickedItem.classList);
    }

    function removeSelection() {
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("selected");
        console.log("selection removed");
      }
    }

    function init() {
      for (var i = 0; i < items.length; i++) {
        items[i].addEventListener("click", handleClick);
        console.log("Items loaded");
      }
    }

    init();