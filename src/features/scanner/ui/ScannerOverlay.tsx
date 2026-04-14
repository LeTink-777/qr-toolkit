import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { spacing } from '@/shared/theme/spacing';

const FRAME_SIZE = 260;
const CORNER_LENGTH = 30;
const CORNER_WIDTH = 4;
const SCAN_LINE_HEIGHT = 2;

/** Overlay с рамкой прицела и анимированной сканирующей линией */
export function ScannerOverlay() {
  const scanLineY = useSharedValue(0);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withTiming(FRAME_SIZE - SCAN_LINE_HEIGHT, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [scanLineY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Затемнение вокруг рамки */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.frame}>
            {/* Угловые маркеры */}
            <Corner position="topLeft" />
            <Corner position="topRight" />
            <Corner position="bottomLeft" />
            <Corner position="bottomRight" />
            {/* Сканирующая линия */}
            <Animated.View style={[styles.scanLine, scanLineStyle]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>
    </View>
  );
}

type CornerPosition = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

function Corner({ position }: { position: CornerPosition }) {
  const cornerStyles = [
    styles.corner,
    position === 'topLeft' && styles.cornerTopLeft,
    position === 'topRight' && styles.cornerTopRight,
    position === 'bottomLeft' && styles.cornerBottomLeft,
    position === 'bottomRight' && styles.cornerBottomRight,
  ];

  return <View style={cornerStyles} />;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: CORNER_LENGTH,
    height: CORNER_LENGTH,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: '#FFFFFF',
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: '#FFFFFF',
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: '#FFFFFF',
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: '#FFFFFF',
  },
  scanLine: {
    position: 'absolute',
    left: spacing.sm,
    right: spacing.sm,
    height: SCAN_LINE_HEIGHT,
    backgroundColor: '#007AFF',
    borderRadius: 1,
  },
});
