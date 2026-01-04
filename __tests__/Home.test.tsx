import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { useAuthStore } from '@/store/useAuthStore'
import useSWR from 'swr'

// Mock modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/store/useAuthStore')

jest.mock('react-markdown', () => ({
    __esModule: true,
    default: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('remark-gfm', () => ({
    __esModule: true,
    default: () => {},
}))

// Mock dependencies components to avoid errors
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className }: any) => <div className={className}>{children}</div>,
        h2: ({ children, className }: any) => <h2 className={className}>{children}</h2>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders guest view when user is not logged in', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: null,
    });
    // SWR shouldn't be called effectively or result ignored if user is null
    (useSWR as unknown as jest.Mock).mockReturnValue({
        data: null,
        isLoading: false,
    });

    render(<Home />)
    
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.queryByText('Your collection of moments')).not.toBeInTheDocument()
  })

  it('renders dashboard with entries when logged in', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { _id: '1', name: 'Test User' },
    });

    const mockEntries = [
        {
            _id: '1',
            title: 'Test Entry',
            content: 'Test content',
            mood: 'Happy',
            tags: ['test'],
            createdAt: new Date().toISOString(),
            userId: '1'
        }
    ];

    (useSWR as unknown as jest.Mock).mockReturnValue({
        data: mockEntries,
        isLoading: false,
    });

    render(<Home />)
    
    expect(screen.getByText('Your collection of moments')).toBeInTheDocument()
    expect(screen.getByText('Test Entry')).toBeInTheDocument()
  })

  it('renders loading state when fetching entries', () => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { _id: '1', name: 'Test User' },
    });

    (useSWR as unknown as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
    });

    render(<Home />)
    
    expect(screen.getByText('Gathering memories...')).toBeInTheDocument()
  })

  it('renders empty state when no entries found', () => {
     (useAuthStore as unknown as jest.Mock).mockReturnValue({
        user: { _id: '1', name: 'Test User' },
    });

    (useSWR as unknown as jest.Mock).mockReturnValue({
        data: [],
        isLoading: false,
    });

    render(<Home />)
    
    expect(screen.getByText('A fresh page awaits')).toBeInTheDocument()
  })
})