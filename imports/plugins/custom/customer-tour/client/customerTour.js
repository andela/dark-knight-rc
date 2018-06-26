import React from "react";
import introJs from 'intro.js'
import { Reaction } from '/client/api'
import { landingSteps, productsSteps, paymentSteps } from './onboarding-steps/index'

const intro = introJs();

export const landingTour = () => {
  intro.setOptions({
    skipLabel: 'Exit',
    showProgress: true,
    showStepNumbers: false,
    doneLabel: "Next page",
    steps: landingSteps
  });

  intro.start();
};

export const paymentTour = () => {
  intro.setOptions({
    steps: paymentSteps,
    doneLabel: "Finish",
    showProgress: true,
  });

  intro.start();
}

export const productsTour = () => {
  intro.setOptions({
    steps: productsSteps,
    showProgress: true
  });

  intro.start();
}
