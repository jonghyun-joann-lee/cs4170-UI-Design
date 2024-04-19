from flask import Flask, session
from flask import render_template, redirect, url_for
from flask import Response, request, jsonify
import json
import os

app = Flask(__name__)
# Generate a random secret key each time the app starts
app.secret_key = os.urandom(24)

# Load all data once and store as global variables
chapters_data = {}  # Dictionary to store all chapter data
chapter_ids = ["1", "2", "3"]
for chapter_id in chapter_ids:
    with open(f'data/chapter_{chapter_id}.json') as chapter_file:
        chapters_data[chapter_id] = json.load(chapter_file)

with open('data/quiz.json') as quiz_file:
    quiz_data = json.load(quiz_file)


# ROUTES
@app.route('/')
def home():
    img_dog = 'static/images/home_dog.png'
    img_bowl = 'static/images/home_bowl.png'
    return render_template('home.html', img_dog=img_dog, img_bowl=img_bowl)   

@app.route('/learn/chapter_<int:chapter_id>')
def learn(chapter_id):
    chapter_id = str(chapter_id)
    chapter_data = chapters_data.get(chapter_id)
    if not chapter_data:
        return "Chapter not found", 404

    # Initialize or update session data for nutrients read
    if 'nutrients_read' not in session:
        session['nutrients_read'] = []

    nutrients_read = session['nutrients_read']
    all_nutrients = set(chapter_data['content'].keys()) - {'bowl'}  # Assume 'bowl' is not a nutrient
    all_read = set(nutrients_read) == all_nutrients
    
    return render_template(f'chapter_{chapter_id}.html', chapter=chapter_data, 
                           nutrients_read=nutrients_read, all_read=all_read)

@app.route('/review_chapters')
def review_chapters():
    return render_template('review_chapters.html', chapters=chapters_data)

@app.route('/quiz')
def quiz_intro(): 
    session['score'] = 0  # Initialize the score
    session['review_chapters'] = []  # Initialize the list of chapters to review
    return render_template('quiz_intro.html')
    
@app.route('/quiz/question_<int:question_id>', methods=['GET', 'POST'])
def quiz_question(question_id):
    question = quiz_data.get(str(question_id))
    if not question:
        return redirect(url_for('quiz_intro'))  # Redirect to intro if invalid id
    
    total_questions = int(quiz_data.get('total_questions')) # Total number of questions
    total_score = quiz_data.get('total_score') # Total possible score
    
    # Get quiz data for matching question id
    question = quiz_data.get(str(question_id))
    
    feedback = None
    if request.method == 'POST':
        selected_option = request.form.get('selected_option')
        correct = selected_option == question['answer']
        if correct:
            session['score'] += 1  # Increment score if correct
        else:
            # Add related chapters to the session if the answer is incorrect
            for chapter in question['related_chapter']:
                if chapter not in session['review_chapters']:
                    session['review_chapters'].append(chapter)
            session.modified = True
            
        feedback = {
            'correct': correct,
            'message': 'Correct!' if correct else 'Incorrect.',
            'correct_answer': question['answer'],
            'explanation': question.get('explanation', ''),
            'current_score': session['score'],
            'total_score': total_score,
            'next_question': question.get('next_question')
            }
        
        return jsonify(feedback)

    # GET request: show the question page
    return render_template('quiz_question.html', question=question, total_questions=total_questions,
                           total_score=total_score, current_score=session.get('score'))
    
@app.route('/quiz/results')
def quiz_results():
    score = session.get('score', 0)
    total_score = quiz_data.get('total_score')
    review_chapters = sorted(session.get('review_chapters', []))
    return render_template('quiz_results.html', score=score, total_score=total_score, 
                           review_chapters=review_chapters, chapters=chapters_data)


# AJAX
@app.route('/update_nutrient_read', methods=['POST'])
def update_nutrient_read():
    chapter_id = request.form['chapter_id']
    nutrient_name = request.form['nutrient_name']

    print(session['nutrients_read'])
    # Add nutrient to the read list if not already included
    if nutrient_name not in session['nutrients_read']:
        session['nutrients_read'].append(nutrient_name)
        session.modified = True

    # Check if all nutrients are read
    all_nutrients = set(chapters_data[chapter_id]['content'].keys()) - {'bowl'}
    all_read = set(session['nutrients_read']) == all_nutrients
    
    return jsonify({'all_read': all_read})


if __name__ == '__main__':
   app.run(debug = True)