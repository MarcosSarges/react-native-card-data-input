# react-native-card-data-input

just another credit card input package

## Installation

```sh
npm install react-native-card-data-input
```

## Features

- card brand logo
- flip _(and shake)_ animation
- validations
- security code input blocked while a card brand isn't recognized.

## Card Data

- `number` for the card number.
- `holder` for the name written on card.
- `expiry` for validity date (MM/YY format).
- `cvv` for security code.

## Usage

```js
import { CardFlip, CardRef } from 'react-native-card-data-input';

// ...
const ref = React.useRef(null);
<CardFlip ref={ref} {...another props} />;
```

```js
ref.current?.someMethod(); // change 'someMethod' with any of the methods described on section *Props => Ref Props* below
```

# Props

All of them are optional.

- `data`: an object like **Card Data** section above (_all values are strings_).
- `background`: a color string (e.g. _#9a9a9a_) or JSX (e.g. _`<LinearGradient />`_)
- `labels`: an object containing `securityCode` and its _string_ value.
- `placeholders`: an object containing each property in **Card Data** section and its _string_ values, except for `cvv`.
  - value for `cvv` should be a function that receives a number as parameter, representing the _security code length_ (it can have either 3 or 4 characters), and returns a _string_.
- `onValidStateChanged`: a function that receives a **isValid** _boolean_ parameter and must return nothing.
- `readOnly`: a _boolean_ or an object containing each property in **Card Data** section and its _boolean_ values.
  - if its value is a _boolean_, all fields will use this value.

## Ref Props

- `flip()` to flip the card anytime.
- `shake()` to ask for attention.
- `getCardData()` to get data inserted by user.
  - returns an object with:
    - `data`: an object containing each of the properties described on **Card Data** section above, with its _string_ values. Or _null_ if there are errors.
    - `errors`: an array of error codes, described on **Error Codes** section below. If no errors, an _empty array_ will be returned.
- `clear()` to clear inputs values:
  - it can receive an object as parameter, containing any of the properties described on **Card Data** section above, telling which inputs should be cleared (using a _true_ value for the ones you wish to clear, properties with _false_ value should not be cleared).
  - if no parameter is provided, all inputs will be cleared.
  - if a field is marked as _read-only_, it will not be cleared (no matter what).

## Error Codes

When asking for card data using `getCardData()` and validation doesn't pass, will be returned an array named **errors** telling you which errors ocurred on validation.

The errors can be these:

- `NOT_VALID_CARD_NUMBER`
- `NOT_VALID_EXPIRATION_DATE`
- `NOT_VALID_OWNER_NAME`
- `NOT_VALID_SECURITY_CODE`

An object containing these errors can be imported using `ErrorsEnum` name.

## Typescript

- `CardRef` contains types to use when creating a _Ref_.
- `CardData` is an object with each property name described in **Card Data** section.
- `CardError` contains all the possible errors as literal strings.
- `CardDataResponse` is an object containing the types from `getUserData()` return.
