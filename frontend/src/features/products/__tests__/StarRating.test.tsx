import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StarRating } from '../components/StarRating';

describe('StarRating', () => {
  it('renders exactly 5 star elements', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText('★');
    expect(stars).toHaveLength(5);
  });

  it('sets the correct accessible title with the rating value', () => {
    render(<StarRating rating={4.5} />);
    expect(screen.getByTitle('4.5 out of 5')).toBeInTheDocument();
  });

  it('has no half-opacity star for a whole number rating', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText('★');
    const halfOpacityStars = stars.filter((s) => s.className.includes('opacity-70'));
    expect(halfOpacityStars).toHaveLength(0);
  });

  it('has 3 full stars for rating 3.0', () => {
    render(<StarRating rating={3} />);
    const stars = screen.getAllByText('★');
    const fullStars = stars.filter((s) => !s.className.includes('text-slate-600') && !s.className.includes('opacity-70'));
    expect(fullStars).toHaveLength(3);
  });

  it('shows a half-star for rating 3.5', () => {
    render(<StarRating rating={3.5} />);
    const stars = screen.getAllByText('★');
    const halfStar = stars.filter((s) => s.className.includes('opacity-70'));
    expect(halfStar).toHaveLength(1);
  });

  it('shows all 5 full stars for rating 5', () => {
    render(<StarRating rating={5} />);
    const stars = screen.getAllByText('★');
    const dimStars = stars.filter((s) => s.className.includes('text-slate-600'));
    expect(dimStars).toHaveLength(0);
  });

  it('shows all 5 dim stars for rating 0', () => {
    render(<StarRating rating={0} />);
    const stars = screen.getAllByText('★');
    const dimStars = stars.filter((s) => s.className.includes('text-slate-600'));
    expect(dimStars).toHaveLength(5);
  });
});
