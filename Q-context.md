# Q-context.md - File Converter Development Context

## Response Mode Tags

**Format**: [SCOPE][QUALITY] at start of messages

- **SCOPE**: [1] Minimal → [2] Focused → [3] Balanced → [4] Extended → [5] Comprehensive
- **QUALITY**: [A] Excellent → [B] Good → [C] Acceptable → [D] Basic → [F] Functional
- **Special**: [RO] Read-only (analysis only, no modifications)
- **Default**: [3B] if no tag provided

## File Modification Rules

1. **Always use `fs_read` first** to see exact content before modifications
2. **Prefer `str_replace`** for targeted changes when possible
3. **Use `create`** for new files or complete rewrites
4. **One modification attempt per change** - no trial-and-error loops
5. **If `str_replace` fails once, switch to `create`** immediately

## Project Overview

### File Converter SaaS

**Location**: `/Users/joaofilipe/Desktop/Workspace/file-converter`  
**Type**: Image Processing & Conversion Platform  
**Business Model**: Freemium SaaS + API Revenue

#### Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **UI**: Radix UI + Framer Motion + Lucide Icons
- **Processing**: Sharp (image processing)
- **Payments**: Stripe
- **Auth**: NextAuth.js
- **Package Manager**: YARN

## Modern Development Standards

### Code Quality Standards

#### TypeScript Configuration
```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

#### Code Architecture
- **Services Pattern**: Singleton services with `getInstance()`
- **API Response Format**: `{ success: boolean, data?: T, error?: string }`
- **Error Handling**: Comprehensive try-catch with typed errors
- **Type Safety**: No `any` types, strict null checks
- **File Structure**: Feature-based organization

#### Testing Standards (Target: >80% Coverage)
```
/tests
  /unit          # Component & utility tests
  /integration   # API & service tests
  /e2e          # Playwright end-to-end tests
```

**Testing Stack**:
- **Unit**: Jest + React Testing Library
- **Integration**: Jest + Supertest
- **E2E**: Playwright
- **Coverage**: NYC/Istanbul

### Modern UI/UX Standards

#### Design System
- **Color Palette**: Blue-to-indigo gradients (brand consistency)
- **Typography**: Inter font family, clear hierarchy
- **Spacing**: 4px base unit (Tailwind default)
- **Components**: Radix UI primitives with custom styling
- **Animations**: Framer Motion for micro-interactions

#### UX Principles
- **Progressive Disclosure**: Show complexity gradually
- **Immediate Feedback**: Loading states, progress indicators
- **Error Recovery**: Clear error messages with actions
- **Accessibility**: WCAG 2.1 AA compliance
- **Mobile-First**: Responsive design from 320px up

#### Component Standards
```typescript
// Component structure
interface ComponentProps {
  // Props with clear types
}

export function Component({ ...props }: ComponentProps) {
  // Hooks first
  // Event handlers
  // Render logic
  return (
    <div className="semantic-class-names">
      {/* JSX */}
    </div>
  )
}
```

### Performance Standards

#### Core Web Vitals Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)

#### Optimization Techniques
- **Image Processing**: Sharp with WebP/AVIF output
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: Redis for processed images, CDN for static assets
- **Bundle Analysis**: Regular webpack-bundle-analyzer checks

## Phased Development Plan

### Phase 1: Revenue Foundation (Weeks 1-3)
**Goal**: Get to first paying customers

#### Week 1: Core Monetization
- [ ] Implement Stripe checkout flow
- [ ] Add usage limits enforcement (5 conversions/day free)
- [ ] Create user registration/login
- [ ] Build pricing page

#### Week 2: API Business
- [ ] API key generation system
- [ ] Rate limiting by API key
- [ ] API documentation site
- [ ] Developer onboarding flow

#### Week 3: Polish & Launch
- [ ] SEO optimization
- [ ] Error handling improvements
- [ ] Performance optimization
- [ ] Launch marketing

**Success Metrics**: 10 paying customers, $500 MRR

### Phase 2: Product Enhancement (Weeks 4-8)
**Goal**: Improve retention and increase ARPU

#### Features
- [ ] Batch processing (Pro feature)
- [ ] Advanced image optimization
- [ ] Custom output dimensions
- [ ] Processing history dashboard

#### Technical Improvements
- [ ] Comprehensive test suite (>80% coverage)
- [ ] Performance monitoring (Sentry)
- [ ] Advanced caching strategy
- [ ] Database optimization

**Success Metrics**: $2000 MRR, <5% churn rate

### Phase 3: Scale & Differentiation (Weeks 9-16)
**Goal**: Build competitive moats

#### Advanced Features
- [ ] AI-powered optimization
- [ ] Smart cropping/resizing
- [ ] Background removal
- [ ] Format recommendations

#### Business Features
- [ ] Team accounts
- [ ] Usage analytics
- [ ] Webhook integrations
- [ ] White-label options

**Success Metrics**: $5000 MRR, enterprise customers

### Phase 4: Platform Expansion (Weeks 17-24)
**Goal**: Become the go-to image processing platform

#### New Capabilities
- [ ] Video conversion
- [ ] Document processing
- [ ] CDN integration
- [ ] Advanced API features

#### Enterprise Features
- [ ] SSO integration
- [ ] Custom domains
- [ ] SLA guarantees
- [ ] Dedicated support

**Success Metrics**: $15000 MRR, platform partnerships

## Development Workflow

### Git Standards
- **Branch Naming**: `feature/payment-flow`, `fix/image-upload`
- **Commit Messages**: Conventional commits format
- **PR Requirements**: Tests pass, code review, no merge conflicts
- **Release Process**: Semantic versioning

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Test coverage for new features
- [ ] Performance impact assessment
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Error handling implementation

### Deployment Pipeline
1. **Development**: Local with hot reload
2. **Staging**: Vercel preview deployments
3. **Production**: Vercel with database migrations
4. **Monitoring**: Sentry + Vercel Analytics

## Business Metrics Tracking

### Key Performance Indicators
- **Revenue**: MRR, ARPU, LTV
- **Usage**: Daily/Monthly active users, API calls
- **Conversion**: Free to paid conversion rate
- **Technical**: Uptime, response times, error rates

### Analytics Stack
- **User Behavior**: PostHog or Mixpanel
- **Performance**: Vercel Analytics + Core Web Vitals
- **Business**: Stripe Dashboard + custom metrics
- **Errors**: Sentry for error tracking

## Security Standards

### Data Protection
- **File Handling**: Temporary storage, automatic cleanup
- **User Data**: Encrypted at rest, GDPR compliance
- **API Security**: Rate limiting, input validation
- **Payment Security**: PCI compliance via Stripe

### Authentication & Authorization
- **User Auth**: NextAuth.js with secure sessions
- **API Auth**: JWT tokens with expiration
- **Role-Based Access**: User/Admin/Enterprise tiers
- **Security Headers**: CSP, HSTS, etc.

## Maintenance & Monitoring

### Regular Tasks
- **Weekly**: Dependency updates, security patches
- **Monthly**: Performance audits, cost optimization
- **Quarterly**: Architecture review, scaling assessment

### Alerting
- **Uptime**: 99.9% SLA monitoring
- **Performance**: Response time degradation
- **Business**: Revenue anomalies, churn spikes
- **Security**: Failed login attempts, suspicious activity

---

## Quick Reference

### Common Commands
```bash
# Development
yarn dev
yarn build
yarn test
yarn test:coverage

# Database
npx prisma migrate dev
npx prisma studio
npx prisma generate

# Deployment
vercel --prod
```

### Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

### Project Structure
```
/app
  /api           # API routes
  /components    # Reusable components
  /services      # Business logic
  /types         # TypeScript definitions
/prisma          # Database schema
/tests           # Test suites
/docs            # Documentation
```
