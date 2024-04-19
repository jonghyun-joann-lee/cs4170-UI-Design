$(document).ready(function () {
    // Set the image count for each container
    $('.card-img-container').each(function () {
        var img_count = $(this).find('img').length; // Count images
        console.log(img_count);
        $(this).css('--img-count', img_count.toString()); // Set CSS variable
    });

    $('#previous-chapter').click(function () {
        window.location.href = '/learn/chapter_2';
    });
    $('#start-quiz').click(function () {
        window.location.href = '/quiz';
    });
});