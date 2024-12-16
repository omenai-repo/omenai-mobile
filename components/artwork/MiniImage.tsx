import { useImage, Image } from 'expo-image';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

export default function MiniImage({maxWidth, url}:{url: string, maxWidth: number}) {

    const imageOptions = useMemo(() => ({
        maxWidth: maxWidth - 10,
        onError: (error: Error, retry: () => void) => {
          console.error('Loading failed:', error.message);
        },
      }), [maxWidth]);
    
      const image = useImage(url, imageOptions);

  if (!image) {
    return <View
        style={{width: maxWidth - 10, height: 250, backgroundColor: '#f5f5f5'}}
    />
  }

  return (
        <Image 
            source={image} 
            style={{ width: maxWidth - 10, height: 250}} 
            cachePolicy={'memory'}
            transition={100}
            contentFit="contain"
        />
    )
}