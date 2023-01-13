import { render, screen } from "@testing-library/react";
import UIBox from "./UIBox";

describe('Box Component', () => {

  it('should render content', () => {
    render(<UIBox> something </UIBox>)

    expect(screen.getByText('something')).toBeInTheDocument()
  })

  it('should run the callback on click', () => {
    
  })

})