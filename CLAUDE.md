# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Expo mortgage application targeting the US market. The app provides a user-friendly interface for mortgage-related services with a focus on security and accessibility.

## Development Commands

- **Install dependencies**: `npm install`
- **Start development server**: `npx expo start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`
- **Run on web**: `npm run web`
- **Lint code**: `npm run lint`
- **Reset project**: `npm run reset-project` (moves starter code to app-example directory)

## Architecture

### Navigation Structure
- Uses Expo Router with file-based routing
- Root layout in `app/_layout.tsx` with Stack navigation
- Tab navigation in `app/(tabs)/_layout.tsx` with Home and Explore tabs
- Supports both light and dark themes via `@react-navigation/native`

### Component Architecture
- **Themed Components**: `ThemedText` and `ThemedView` for consistent theming
- **UI Components**: Platform-specific components in `components/ui/` (iOS variants available)
- **Reusable Components**: Located in `components/` directory
- **Custom Hooks**: Theme and color scheme management in `hooks/`

### Styling and Theming
- Uses React Navigation's theme system with light/dark mode support
- Color constants defined in `constants/Colors.ts`
- Custom font loading (SpaceMono) handled in root layout
- Platform-specific styling patterns (especially for iOS blur effects)

### Key Technologies
- React Native 0.79.4 with React 19.0.0
- Expo SDK ~53.0.15 with Expo Router ~5.1.2
- TypeScript configuration
- ESLint with Expo configuration

## Security Focus
Based on Project.md, this app implements:
- Multiple login methods (phone, email, username)
- Two-factor authentication via SMS
- HTTPS encryption requirements
- Biometric authentication support
- Account lockout mechanisms

## File Structure Notes
- `app/` directory contains all route files
- `components/` contains reusable UI components
- `assets/` contains fonts and images
- `constants/` contains app-wide constants
- `hooks/` contains custom React hooks