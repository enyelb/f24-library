import { Validators } from "./validators"

/**
 * iphone
 */
export interface IPhoneMatcher {
  match?: string[]
  min?: number
  max?: number,
  length?: number
}
/**
 * iphone
 */
export interface IPhone {
  area?: IPhoneMatcher
  exchange?: IPhoneMatcher
  subscriber?: IPhoneMatcher
}

/**
 * countries
 */
export const countries: {[key: string]: IPhone } = {
  ve: {
    area: {
      match: ['0412', '0414', '0416', '0422', '0424', '0426', '0212', '0261', '0241', '0251', '0243', '0281', '0276', '0285', '0286', '0274', '0269', '0273', '0293', '0295', '0244', '0245', '0246', '0247', '0248', '0249', '0252', '0253', '0254', '0255', '0256', '0257', '0258', '0259', '0262', '0263', '0264', '0265', '0266', '0267', '0268', '0271', '0272', '0275', '0277', '0278', '0279', '0282', '0283', '0284', '0287', '0288', '0289', '0291', '0292', '0294', '0296', '0297', '0298', '0299'],
      length: 4,
    },
    exchange: {
      length: 3
    },
    subscriber: {
      length: 4
    }
  }
}

/**
 * Phone
 */
export class Phone {

  /**
   * constructor
   * @param area
   * @param exchange
   * @param subscriber
   */
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string,
    public matchers: IPhone = countries['ve'],
  ) {}

  /**
   * isValid
   * @returns
   */
  isValid(): boolean {
    if (!this.area || !this.exchange || !this.subscriber || this.area.length !== 3 || this.exchange.length !== 3 || this.subscriber.length !== 4) {
      return false;
    }
    return true;
  }

  /**
   * number
   * @returns
   */
  number(): string {
    return `${this.area}${this.exchange}${this.subscriber}`;
  }

  /**
   * equal
   * @param phone
   * @returns
   */
  equal(phone: Phone | null): boolean {
    if (!phone) {
      return false;
    }
    if (this === phone ||
      (phone?.area === this.area &&
        phone?.exchange === this.exchange &&
        phone?.subscriber === this.subscriber)
    ) {
      return true;
    } else {
      return false
    }
  }

  /**
   * errors
   * @returns
   */
  errors(): {[key: string]: boolean} | null {
    const areaError = this.error(this.area, 'phone', this.matchers.area);
    if (areaError) {
      return areaError;
    }
    const exchangeError = this.error(this.exchange, 'phone', this.matchers.exchange);
    if (exchangeError) {
      return exchangeError;
    }
    const subscriberError = this.error(this.subscriber, 'phone', this.matchers.subscriber);
    if (subscriberError) {
      return subscriberError;
    }
    if (!this.matchers && !this.isValid()) {
      return { phone: true }
    }
    return null;
  }

  /**
   * error
   * @param value
   * @param matcher
   * @returns
   */
  error(value: string, prefix: string, matcher?: IPhoneMatcher): { [key: string]: any } | null {

    if (!matcher) {
      return null;
    }

    if (matcher.match) {
      return !matcher.match.includes(value) ? {
        [`${prefix}_match`]: {
          match: matcher.match
        }
      } : null;
    } else if (matcher.length && matcher.length !== value.length) {
      return {
        [`${prefix}_length`]: {
          length: matcher.length
        }
      }
    } else {
      if (matcher.min && matcher.min > value.length) {
        return {
          [`${prefix}_min`]: {
            min: matcher.min
          }
        }
      }
      if (matcher.max && matcher.max < value.length) {
        return {
          [`${prefix}_max`]: {
            max: matcher.max
          }
        };
      }
    }
    return null;
  }

  /**
   * validators
   * @returns
   */
  static validators(matcher?: IPhoneMatcher) {
    if (!matcher) {
      return null;
    }

    const validators = [];

    if (matcher.match) {
      validators.push(Validators.match(matcher.match));
    } else {
      if (matcher.length) {
        validators.push(Validators.maxLength(matcher.length), Validators.minLength(matcher.length));
      }
      if (matcher.min) {
        validators.push(Validators.minLength(matcher.min));
      }
      if (matcher.max) {
        validators.push(Validators.maxLength(matcher.max));
      }
    }
    if (!validators.length) {
      return null;
    }
    validators.push(Validators.required);
    return validators;
  }
}
