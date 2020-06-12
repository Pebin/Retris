import React from 'react';
import {render} from '@testing-library/react';
import Game from "./Game";

test('Game contains score', () => {
  const {getByText} = render(<Game/>);
  const linkElement = getByText(/Score:/i);
  expect(linkElement).toBeInTheDocument();
});
