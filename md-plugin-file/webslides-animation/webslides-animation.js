const WebSlidesAnimation = function(ws) {

  this.goNextOrigin = ws.goNext;

  this.eventNames = {
    slideChange: 'ws:slide-change',
    goNextStep: 'ws:slide-go-next-step',
    resetStep: 'ws:slide-reset'
  };

  this.classNames = {
    animated: 'animated'
  };

  this.attributeNames = {
    maxStep: 'data-step-count',
    currentStep: 'data-current',
    step: 'data-step'
  };

  this.init = function() {
    ws.el.addEventListener(this.eventNames.slideChange, this.onSlideChange.bind(this));
    ws.el.addEventListener(this.eventNames.resetStep, this.onResetStep.bind(this));
    this.onSlideChange();
  };

  this.createEvent = function(eventName) {
    return new Event(eventName);
  }

  this.createCustomEvent = function(eventName, detail) {
    return new CustomEvent(eventName, {detail: detail});
  }

  this.getDocument = function() {
    return (this.document === undefined) ? document : this.document;
  }

  this.getTargetSection = function() {
    return this.getDocument().querySelector('#section-' + (ws.currentSlideI_ + 1));
  };

  this.resetSlides = function() {
    ws.goNext = this.goNextOrigin;
    ws.el.dispatchEvent(this.createEvent(this.eventNames.resetStep));
  };

  this.findStepInfo = function(targetSection) {
    const infoElement = targetSection ? targetSection.querySelector('*[' + this.attributeNames.maxStep + ']') : null;
    return {
      getMaxStep: function() {
        return infoElement && infoElement.hasAttribute(this.attributeNames.maxStep) ? Number(infoElement.getAttribute(this.attributeNames.maxStep)) : 0;
      }.bind(this),
      getCurrentStep: function() {
        return infoElement && infoElement.hasAttribute(this.attributeNames.currentStep) ? Number(infoElement.getAttribute(this.attributeNames.currentStep)) : 0;
      }.bind(this),
      setCurrentStep: function(nextStep) {
        if (infoElement) {
          infoElement.setAttribute(this.attributeNames.currentStep, nextStep);
        }
      }.bind(this)
    };
  };

  this.onSlideChange = function() {
    this.resetSlides();
    const targetSection = this.getTargetSection();
    const stepInfo = this.findStepInfo(targetSection);
    if (stepInfo.getMaxStep() > 0) ws.goNext = this.overrideGoNext(targetSection).bind(this);
  };

  this.overrideGoNext = function(targetSection) {
    return function() {
      const stepInfo = this.findStepInfo(targetSection);
      const maxStep = stepInfo.getMaxStep();
      const nextStep = stepInfo.getCurrentStep() + 1;

      ws.el.dispatchEvent(this.createCustomEvent(this.eventNames.goNextStep, {
        targetSection: targetSection,
        currentStep: nextStep,
        maxStep: maxStep
      }));
      targetSection
        .querySelectorAll('*[' + this.attributeNames.step + '="' + nextStep + '"]')
        .forEach(function(target) {
          target.classList.add(this.classNames.animated);
        }.bind(this));
      if (nextStep >= maxStep) {
        ws.goNext = this.goNextOrigin;
      }
      stepInfo.setCurrentStep(nextStep);
    }.bind(this);
  };

  this.onResetStep = function(e) {
    const targetSection = this.getTargetSection();
    const stepInfo = this.findStepInfo(targetSection);
    stepInfo.setCurrentStep(0);
    this.getDocument()
      .querySelectorAll('*[' + this.attributeNames.step + '].' + this.classNames.animated)
      .forEach(function(target) {
        target.classList.remove(this.classNames.animated);
      }.bind(this));
  };

  if (typeof Event !== 'undefined' && typeof CustomEvent !== 'undefined') {
    this.init();
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = WebSlidesAnimation;
}
