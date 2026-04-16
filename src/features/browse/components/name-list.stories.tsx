import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { useEffect } from 'react';

import { useFilterStore } from '../stores/filter-store';

import { NameList } from './name-list';

function Framed() {
  useEffect(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    });
  }, []);

  return (
    <div className="w-[352px] bg-cream-light p-6">
      <NameList />
    </div>
  );
}

const meta = {
  title: 'Browse/NameList',
  component: Framed,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Framed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('*/api/names', () => HttpResponse.json({ data: [] })),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [http.get('*/api/names', () => new Promise(() => {}))],
    },
  },
};
