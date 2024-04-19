$(document).ready(function() {
    $('.nutrient').click(function() {
        const key = $(this).data('key'); // Name of nutrient clicked
        let content = $('#nutrients').data('content');
        let details = content[key]; // Get nutrient details

        // Build HTML for the detail view
        let html = '<h3>' + details.subtitle + '</h3>' +
                   '<p>' + details.info + '</p>' +
                   '<ul>';
        
        details.sources.forEach(function(source) {
            html += '<li><img src="' + source.img + '" alt="' + source.caption +
                    '" width="100"><br>' + source.caption + '</li>';
        });
        html += '</ul>';
        html += '<p class="advice-text">' + details.advice.join(" ") + '</p>';

        // Hide main chapter content
        $('#chapter-title, #bowl, #nutrients, #instruction, #next-chapter').hide();
        
        // Display nutrient details and show back button
        $('#nutrient-detail').html(html).show();
        $('#back-button').show();
    
        // Check if this is the first time the nutrient has been clicked and update server session
        if (!$(this).hasClass('nutrient-read')) {
            $(this).addClass('nutrient-read');
            // Send AJAX to update session
            $.post('/update_nutrient_read', {chapter_id: 1, nutrient_name: key}, function(data) {
                console.log(data.all_read)
                // Enable Next Chapter button if all nutrients are read
                if (data.all_read) {
                    $('#next-chapter').removeClass('disabled').prop('disabled', false);
                }
            });
        }
    });

    $('#back-button').click(function() {
        // Show main chapter content
        $('#chapter-title, #bowl, #nutrients, #instruction, #next-chapter').show();

        // Hide details and back button
        $('#nutrient-detail').hide();
        $(this).hide();
    });

    $('#next-chapter').click(function() {
        window.location.href = '/learn/chapter_2'; 
    })

});
