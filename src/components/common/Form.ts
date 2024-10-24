
import { IEvents } from "../base/events";
import { IForm } from "../../types";
import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

// Класс Form наследуется от Component и имеет тип параметра T. В конструкторе класса устанавливаются обработчики событий для событий ввода и отправки формы.
export class Form<T> extends Component<IForm> {
  submitButton: HTMLButtonElement
  errorsElements: HTMLElement

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container)

    this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container)
    this.errorsElements = ensureElement<HTMLElement>('.form__errors', this.container)

    this.container.addEventListener('input', (e: Event) =>{

      const target = e.target as HTMLInputElement
      const field = target.name as keyof T
      const value = target.value
      this.onInputChange(field, value)
    })

    this.container.addEventListener('submit', (e: Event) =>{
      e.preventDefault()
      this.events.emit(`${this.container.name}:submit`)
    })
  }

//   Метод onInputChange вызывается при изменении значения поля формы и эмитит событие
  protected onInputChange(field: keyof T, value: string) {
    this.events.emit('orderInput:change', {
      field, 
      value
    })
  }
  
  set valid(value: boolean) {
    this.submitButton.disabled = !value
  }

  set errors(value: string) {
    this.setText(this.errorsElements, value)
  }

  render(state: Partial<T> & IForm) {
    const { valid, errors, ...inputs } = state
    super.render({valid, errors})
    Object.assign(this, inputs)
    return this.container
  }
  
}