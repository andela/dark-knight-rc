import React, { Component } from "react";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
// import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { Reviews } from "../../lib/collections";
import ReactStars from "react-stars";
// import "../css/reviews.css";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewSuccess: false,
      addComment: false,
      ratings: null,
      comment: ""
    };
  }
  // componentDidMount() {
  //   console.log(Meteor.user());
  // }
  setTime(input) {
    let time = "";
    let minutes = "";
    let hours = "";
    let days = "";
    const currTime = Math.floor(parseInt(Date.now() - new Date(input).getTime(), 10) / 1000);
    if (currTime < 59) {
      time = `${currTime}s`;
    } else if (currTime > 59 && currTime < 3600) {
      minutes = Math.floor(currTime / 60);
      time = `${minutes}m`;
    } else if (currTime >= 3600 && currTime < 86400) {
      hours = Math.floor(currTime / 3600);
      time = `${hours}h`;
    } else if (currTime >= 86400) {
      days = Math.floor(currTime / 86400);
      time = `${days}d`;
    }
    return time;
  }

  ratingChanged(ratings) {
    this.setState({ ratings });
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  addComment() {
    this.setState({ addComment: true });
  }
  computeRatings(arr) {
    let sumOfRatings = 0;
    arr.map((x) => {
      sumOfRatings += parseInt(x.rating, 10);
    });
    const result = sumOfRatings / arr.length;
    return result;
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const { ratings, comment } = this.state;
    const productId = Reaction.Router.getParam("handle");
    const rate = Math.floor(ratings);
    const { name } = Meteor.user();

    Meteor.call("review/add", comment, rate, productId, name, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        this.setState({ reviewSuccess: true, ratings: null, comment: "" });
        setTimeout(() => {this.setState({ reviewSuccess: false });}, 3000);
      }
    });

    // Clear form
    document.getElementById("add-form").reset();
  }

  render() {
    const { reviewSuccess, addComment, ratings, comment } = this.state;
    const { reviews, allReviews } = this.props;
    return (
      <div>
        {reviewSuccess ? <div className="show" id="snackbar">Review Successful...</div> : ""}
        <span className="headf" style={{ marginTop: "45px" }}><hr/><h3 className="test">Reviews</h3><hr/></span>
        <div style={{ overflow: "scroll", maxHeight: 380, marginBottom: 0 }}>
          {reviews.length > 0 ? reviews.map((review) => {
            return (
              <div key={review._id}>
                <div className="media">
                  <div className="media-left">
                    <div className="char">
                      <p>RC</p>
                    </div>
                  </div>
                  <div className="media-body">
                    <span>
                      <ReactStars
                        count={5}
                        size={20}
                        value={review.rating}
                        edit={false}
                        color2={"#ffd700"}
                      /><span style={{ color: "grey", float: "right" }}><small>{this.setTime(review.createdAt)}</small></span></span>
                    <p>{review.comment}</p>
                    <p> - <b>{review.userName}</b></p>
                  </div>
                </div>
                <hr/>
              </div>
            );
          }) : <h5>No review currently for this product!!!</h5>}
        </div>
        { addComment ?
          <span style={{ float: "right" }}><b>Average Rating:</b>
            <ReactStars
              count={5}
              size={20}
              value={this.computeRatings(allReviews)}
              edit={false}
              color2={"#ffd700"}
            />
          </span> :
          <span style={{ float: "left" }}><b>Average Rating:</b>
            <ReactStars
              count={5}
              size={20}
              value={this.computeRatings(allReviews)}
              edit={false}
              color2={"#ffd700"}
            />
          </span>

        }
        { addComment ?
          <div style={{ marginTop: 75 }}>
            <p>Rate Me:
              <span>
                <ReactStars
                  count={5}
                  onChange={this.ratingChanged.bind(this)}
                  value={this.state.ratings}
                  size={20}
                  color2={"#ffd700"}
                /></span>
            </p>
            <form id="add-form" onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-group">
                {/* <label htmlFor="comment">Comment:</label> */}
                <textarea name="comment" onChange={this.onChange.bind(this)} className="form-control"
                  rows="3"
                  id="comment"
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={ratings !== null && comment.length > 10 ? false : true}>Add Review</button>
            </form>
          </div> : <button style={{ float: "right" }} onClick={this.addComment.bind(this)} className="btn btn-danger" disabled={Meteor.user().emails.length > 0 ? false : true}>Add Review</button>
        }
      </div>
    );
  }
}
const composer = (props, onData) => {
  const productId = Reaction.Router.getParam("handle");
  if (Meteor.subscribe("reviews").ready()) {
    const reviews = Reviews.find({ productId }, { sort: { createdAt: -1 } }).fetch();
    const allReviews = Reviews.find({ productId }).fetch();

    onData(null, { reviews, allReviews });
  }
};
registerComponent("Review", Review, composeWithTracker(composer));

export default composeWithTracker(composer)(Review);
