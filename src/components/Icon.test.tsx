import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icon } from './Icon';

describe('Icon Component', () => {
  const testProps = {
    src: '/logo.svg',
    alt: 'Test Alt Text',
    width: 32,
    height: 26,
    className: 'extra-class',
  };

  it('should render without crashing', () => {
    render(<Icon {...testProps} />);
    const imgElement = screen.getByAltText(testProps.alt);
    
    expect(imgElement).toBeInTheDocument();
  });

  it('should apply src, alt, and className props correctly', () => {
    render(<Icon {...testProps} />);
    const imgElement = screen.getByAltText(testProps.alt) as HTMLImageElement;
    const wrapperDiv = imgElement.parentElement;

    expect(imgElement.src).toContain(testProps.src);
    expect(imgElement).toHaveAttribute('alt', testProps.alt);
    expect(wrapperDiv).toHaveClass('relative');
    expect(wrapperDiv).toHaveClass(testProps.className);
  });

  it('should render correctly without optional className', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { alt, className, ...propsWithoutClass } = testProps; 
    render(<Icon {...propsWithoutClass} alt={alt} />);
    const imgElement = screen.getByAltText(alt);
    const wrapperDiv = imgElement.parentElement;

    expect(imgElement).toBeInTheDocument();
    expect(wrapperDiv).toHaveClass('relative'); 
    expect(wrapperDiv).not.toHaveClass('extra-class'); 
  });
});

