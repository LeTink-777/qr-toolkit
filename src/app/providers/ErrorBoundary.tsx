import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { logger } from '@/shared/lib/logger';
import { Button } from '@/shared/ui/Button';
import { Text } from '@/shared/ui/Text';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Корневой ErrorBoundary. Ловит необработанные ошибки
 * и показывает fallback UI вместо белого экрана.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('ErrorBoundary caught error', {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text variant="title2" style={styles.title}>
            Что-то пошло не так
          </Text>
          <Text variant="body" color="#8E8E93" style={styles.message}>
            Произошла непредвиденная ошибка. Попробуйте перезапустить приложение.
          </Text>
          {__DEV__ && this.state.error && (
            <Text variant="caption1" color="#FF3B30" style={styles.errorText}>
              {this.state.error.message}
            </Text>
          )}
          <Button title="Попробовать снова" onPress={this.handleRetry} />
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});
