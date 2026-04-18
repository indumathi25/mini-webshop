import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CategoryBadge } from '../components/CategoryBadge';

describe('CategoryBadge', () => {
  it('renders the category text', () => {
    render(<CategoryBadge category="Music" />);
    expect(screen.getByText('Music')).toBeInTheDocument();
  });

  it('renders different category values', () => {
    const { rerender } = render(<CategoryBadge category="Books" />);
    expect(screen.getByText('Books')).toBeInTheDocument();

    rerender(<CategoryBadge category="Electronics" />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders as an inline span element', () => {
    render(<CategoryBadge category="Music" />);
    const badge = screen.getByText('Music');
    expect(badge.tagName).toBe('SPAN');
  });

  it('applies the blue badge styling classes', () => {
    render(<CategoryBadge category="Music" />);
    const badge = screen.getByText('Music');
    expect(badge.className).toContain('bg-blue-50');
    expect(badge.className).toContain('text-blue-700');
    expect(badge.className).toContain('rounded-full');
  });
});
