import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '../components/Toolbar';

const defaultProps = {
  resultCount: 42,
  searchQuery: '',
  isLocalHitsActive: false,
  sortBy: 'default',
  onSortByChange: vi.fn(),
};

describe('Toolbar', () => {
  describe('result count', () => {
    it('renders the result count as a number', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders "results" label', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByText(/results/i)).toBeInTheDocument();
    });

    it('shows search query when searchQuery is not empty', () => {
      render(<Toolbar {...defaultProps} searchQuery="vinyl" />);
      expect(screen.getByText(/vinyl/i)).toBeInTheDocument();
    });

    it('does not show query text when searchQuery is empty', () => {
      render(<Toolbar {...defaultProps} searchQuery="" />);
      expect(screen.queryByText(/for/i)).not.toBeInTheDocument();
    });
  });
  
  describe('"Searching server..." badge', () => {
    it('is hidden when isLocalHitsActive is false', () => {
      render(<Toolbar {...defaultProps} isLocalHitsActive={false} />);
      expect(screen.queryByText(/searching server/i)).not.toBeInTheDocument();
    });

    it('is visible when isLocalHitsActive is true', () => {
      render(<Toolbar {...defaultProps} isLocalHitsActive={true} />);
      expect(screen.getByText(/searching server/i)).toBeInTheDocument();
    });
  });

  describe('sort dropdown', () => {
    it('renders a sort label', () => {
      render(<Toolbar {...defaultProps} />);
      expect(screen.getByLabelText(/sort by/i)).toBeInTheDocument();
    });

    it('renders the sort <select> with the current sortBy value selected', () => {
      render(<Toolbar {...defaultProps} sortBy="price-asc" />);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('price-asc');
    });

    it('calls onSortByChange with the new value when selection changes', async () => {
      const onSortByChange = vi.fn();
      render(<Toolbar {...defaultProps} onSortByChange={onSortByChange} />);
      const select = screen.getByRole('combobox');

      await userEvent.selectOptions(select, 'price-desc');

      expect(onSortByChange).toHaveBeenCalledWith('price-desc');
    });
  });
});
