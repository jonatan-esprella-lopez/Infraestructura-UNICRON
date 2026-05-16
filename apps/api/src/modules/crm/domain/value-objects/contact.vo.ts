import { ValidationError } from '../../../../core/errors/validation.error.js';

export interface ContactValue {
  email?: string;
  name: string;
  phone?: string;
}

export class Contact {
  private constructor(private readonly value: ContactValue) {}

  static create(value: ContactValue): Contact {
    if (!value.name.trim()) {
      throw new ValidationError('Lead contact name is required');
    }

    return new Contact({
      email: value.email?.trim(),
      name: value.name.trim(),
      phone: value.phone?.trim(),
    });
  }

  toJSON(): ContactValue {
    return this.value;
  }
}
