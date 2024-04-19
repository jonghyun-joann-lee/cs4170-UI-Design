$(document).ready(function() {
    $('#magnifier').click(function() {
        $('#aafco_intro').addClass('hidden');
        $('#magnifier').addClass('hidden');
        $('#previous-chapter').addClass('hidden');
        $('#aafco_details').removeClass('hidden');
        $('#back-aafco-intro').removeClass('hidden');
        $('#next-dog-foods').removeClass('hidden');
    });

    $('#back-aafco-intro').click(function() {
        $('#aafco_details').addClass('hidden');
        $('#back-aafco-intro').addClass('hidden');
        $('#next-dog-foods').addClass('hidden');
        $('#aafco_intro').removeClass('hidden');
        $('#magnifier').removeClass('hidden');
        $('#previous-chapter').removeClass('hidden');
    });

    $('#next-dog-foods').click(function() {
        $('#aafco_details').addClass('hidden');
        $('#back-aafco-intro').addClass('hidden');
        $('#next-dog-foods').addClass('hidden');
        $('#dog_foods').removeClass('hidden');
        $('#back-aafco-details').removeClass('hidden');
        $('#next-chapter').removeClass('hidden');
    });

    $('#back-aafco-details').click(function() {
        $('#dog_foods').addClass('hidden');
        $('#back-aafco-details').addClass('hidden');
        $('#next-chapter').addClass('hidden');
        $('#aafco_details').removeClass('hidden');
        $('#back-aafco-intro').removeClass('hidden');
        $('#next-dog-foods').removeClass('hidden');
    });

    // Set the image count for each container
    $('.card-img-container').each(function () {
        var img_count = $(this).find('img').length; // Count images
        console.log(img_count);
        $(this).css('--img-count', img_count.toString()); // Set CSS variable
    });

    $('#previous-chapter').click(function() {
        window.location.href = '/learn/chapter_1'; 
    });

    $('#next-chapter').click(function() {
        window.location.href = '/learn/chapter_3';
    });
});