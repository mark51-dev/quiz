import React, {Component} from 'react';
import classes from './Quiz.module.css';
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz';
import FinishedQuiz from "../../components/FinishedQuiz/FinishedQuiz";
import Loader from "../../components/UI/Loader/Loader";
import axios from '../../axios/axios-quiz';

export default class Quiz extends Component {
  state = {
    results: {},
    isFinished: false,
    activeQuestion: 0,
    answerState: null,
    quiz: [
      {
        question: 'Какого цвета небо?',
        rightAnswerId: 2,
        id: 1,
        answers: [
          {
            text: 'Чернок',
            id: 1
          },
          {
            text: 'Синее',
            id: 2
          },
          {
            text: 'Красное',
            id: 3
          },
          {
            text: 'Зеленное',
            id: 4
          }
        ]
      },
      {
        question: 'В каком году основали Санкт-Петербург?',
        rightAnswerId: 3,
        id: 2,
        answers: [
          {
            text: '1700',
            id: 1
          },
          {
            text: '1702',
            id: 2
          },
          {
            text: '1703',
            id: 3
          },
          {
            text: '1803',
            id: 4
          }
        ]
      }
    ],
    loading: true
  };

  onAnswerClickHandler = (answerId) => {
    if (this.state.answerState) {
      const key = Object.keys(this.state.answerState)[0];
      if (this.state.answerState[key] === 'success') {
        return;
      }
    }
    console.log('Answer id', answerId);

    const question = this.state.quiz[this.state.activeQuestion];
    const results = this.state.results;

    if (question.rightAnswerId === answerId) {
      if (!results[question.id]) {
        results[question.id] = 'success';
      }
      this.setState({
        answerState: {[answerId]: 'success'},
        results
      });
      const timeout = setTimeout(() => {
        if (this.isQuizFinished()) {
          this.setState({
            isFinished: true
          });
        } else {
          this.setState({
            activeQuestion: this.state.activeQuestion + 1,
            answerState: null
          });
        }
        clearTimeout(timeout);
      }, 1000);
    } else {
      results[question.id] = 'error';
      this.setState({
        answerState: {[answerId]: 'error'},
        results
      })
    }
  };

  isQuizFinished() {
    return this.state.activeQuestion + 1 === this.state.quiz.length;
  }

  retryHandler = () => {
    this.setState({
      activeQuestion: 0,
      answerState: 0,
      isFinished: false,
      results: {}
    });
  };

  async componentDidMount() {
    try {
      const response = await axios.get(`/quizes/${this.props.match.params.id}.json`);
      const quiz = response.data;
      this.setState({
        quiz,
        loading: false
      });
    } catch (e) {
      console.log(e);
    }
    console.log('Quiz id = ', this.props.match.params.id);
  }

  render() {
    return (
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>Ответье на все вопросы</h1>

          {
            this.state.loading ? <Loader/> :
              this.state.isFinished
                ? <FinishedQuiz results={this.state.results}
                                quiz={this.state.quiz}
                                onRetry={this.retryHandler}
                />
                : <ActiveQuiz answers={this.state.quiz[this.state.activeQuestion].answers}
                              question={this.state.quiz[this.state.activeQuestion].question}
                              onAnswerClick={this.onAnswerClickHandler}
                              quizLength={this.state.quiz.length}
                              answerNumber={this.state.activeQuestion + 1}
                              state={this.state.answerState}

                />}
        </div>
      </div>
    )
  }
}
