$(document).ready(function() {
    $('#quiz-form').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Check if any option is selected
        if (!$('input[name="selected_option"]:checked').val()) {
            alert('Please select an option before submitting.');
            return false;
        }

        const formData = $(this).serialize();  // Serialize the form data

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                // Update the current score
                $('#current-score').html(`Current Score: ${response.current_score}/${response.total_score}`);

                // Display feedback
                if (response.correct) {
                    $('#feedback').html(`<p style="font-size: 20px; font-weight: 500; color: rgb(67, 194, 68);">${response.message}</p>`);
                } else {
                    $('#feedback').html(`<p style="font-size: 20px; font-weight: 500; color: red;">${response.message}</p><p style="font-weight: 600;">Correct Answer: ${response.correct_answer}</p>`);
                }
                
                // Display explanation
                $('#explanation').html(`<p style="font-size: 18px;">Explanation: ${response.explanation}</p>`);

                // Handle navigation
                if (response.next_question) {
                    $('#navigation').html(`<a href="/quiz/question_${response.next_question}" class="btn-green">Next Question</a>`);
                } else {
                    $('#navigation').html(`<a href="/quiz/results" class="btn-green">Finish</a>`);
                }

                // Disable the options to prevent changing the selection
                $('input[type="radio"][name="selected_option"]').prop('disabled', true);

                // Disable the submit button to prevent re-submission
                $('#submit-answer').prop('disabled', true); 
                $('#submit-answer').addClass('disabled');
            }
        });
    });
});
