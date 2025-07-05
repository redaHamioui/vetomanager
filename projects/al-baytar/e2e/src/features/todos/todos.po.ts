import { browser, by, element } from 'protractor';

export class TodosPage {
  navigateTo() {
    return browser.get('#/consultations/todos');
  }

  getInput() {
    return element(by.css('alb-big-input input'));
  }

  getAddTodoButton() {
    return element(by.css('alb-big-input-action button'));
  }

  getResults() {
    return element.all(by.css('mat-card.todo'));
  }
}
