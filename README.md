# react-native-card-data-input

just another credit card input package

## Installation

```sh
npm install react-native-card-data-input
```

## Usage

```js
import { CardFlip } from 'react-native-card-data-input';

// ...
const ref = React.useRef(null);
<CardFlip ref={ref} />;

ref.current.getCardData(); // to get data inserted by user
ref.current.flip(); // flip the card anytime you want
ref.current.shake(); // ask for attention
ref.current.clear(); // clear all inputs
```

## Props

`data`: an object with following props: `number`, `owner`, `expiry`, `cvv`

## Features

- card brand logo
- flip _(and shake)_ animation
- validations

_Security code input will be blocked while a card brand is not recognized._

#### Still Missing

- customization

### Response

`getCardData()` return an object with:

- an object named **data** with following props: `number`, `owner`, `expiry`, `cvv` (or `null` when there's some error on **errors** array)
- an array called **errors** with validation error codes, that are described on next section.

## Errors

When you ask for card data using `getCardData()` and validation doesn't pass, will be returned an array named **errors** telling you which errors ocurred on validation.

The errors are these:

- `NOT_VALID_CARD_NUMBER`
- `NOT_VALID_EXPIRATION_DATE`
- `NOT_VALID_OWNER_NAME`
- `NOT_VALID_SECURITY_CODE`
