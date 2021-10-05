document.addEventListener("DOMContentLoaded", function() {
    
    let widthSlider = document.getElementById('widthSlider');
    let heightSlider = document.getElementById('heightSlider');

    let div = document.getElementById('myCheckbox');

    widthSlider.addEventListener('change', e => {
        div.style.width = e.target.value + 'px';
    });

    heightSlider.addEventListener('change', e => {
        div.style.height = e.target.value + 'px';
    });
});