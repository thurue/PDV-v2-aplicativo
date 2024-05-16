// importando supabase
import { supabase } from '../../ClientSupabase'

import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme

import { useEffect, useState } from 'react';
import { Button, ButtonText, ButtonIcon, Image, GluestackUIProvider, Text, Box, Center, VStack, HStack, styled } from '@gluestack-ui/themed';
import { View, StyleSheet, ScrollView } from 'react-native'; // Importando do 'react-native'
import { useNavigation } from '@react-navigation/native';
export default function Home() {
    const [TODOS, setTodos] = useState([{
        nome: 'Brinquedo pula Pula PUla',
        valor: 4.50,
        imgUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        tipo: 1
    },]);




    const navigation = useNavigation();

    async function getRowsFromTable() {
        try {
            const { data, error } = await supabase
                .from('cardsInfo')
                .select('*');
            if (error) {
                throw error;
            }

            console.log(data[0])
            setTodos(data)
            // console.log('Linhas recuperadas com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro ao recuperar linhas da tabela:', error.message);
            return null;
        }
    }

    const [AttPage, setAttPage] = useState(1)
    useEffect(() => {
        getRowsFromTable();
    }, [AttPage]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAttPage(prevAttPage => prevAttPage - 1);
        }, 20000);

        return () => {
            clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
        };
    }, []); // useEffect é chamado apenas uma vez após a montagem


    return (
        <GluestackUIProvider config={config}>

            <VStack bgColor='#f0f0f0'>

                <HStack width="100%" w={'100%'} h={'$20'} marginTop={'0%'} marginBottom={10} reversed={false} >

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text h={20} fontWeight={900} color='#f89a56'>TODOS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg='#f89a56'></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text h={20} fontWeight={900} color='#b59883'>BEBIDAS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg='#b59883'></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text h={20} fontWeight={900} color='#b59883'>COMIDAS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg='#b59883'></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text h={20} fontWeight={900} color='#b59883'>BRINQUEDOS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg='#b59883'></Box>
                    </VStack>

                </HStack>
                <ScrollView>

                    <View style={styles.gridContainerr}>

                        {TODOS ?
                            TODOS.map((element, index) =>
                            (

                                <VStack key={index} style={styles.shadoww} alignItems='center' justifyContent='space-evenly' w='48%' h={260} bg='#ffffff'
                                    borderRadius={20}
                                    gap={10}
                                    padding={10}
                                >
                                    <Image
                                        alt='imagem'
                                        size="xl"
                                        borderRadius={15}
                                        source={{
                                            uri: element.imgUrl
                                        }}
                                    />
                                    <HStack space='xl'>

                                        <Text color='#664e3c' width={'50%'} fontSize={20} fontWeight={900}>{element.nome}</Text>
                                        <Text color='#f89a56' fontSize={20} fontWeight={900}>R$ {JSON.parse(element.valor).toFixed(2)}</Text>

                                    </HStack>

                                    <Button style={styles.Buttonshadoww} borderRadius={15} bgColor='#fff' size="md" w={'100%'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                                        <ButtonText color='#664e3c' fontSize={20} fontWeight={900} >CARRINHO</ButtonText>
                                    </Button>

                                </VStack>
                            )) : console.log('ainda nao gerou elementos')
                        }

                    </View>

                </ScrollView>
            </VStack>
            <Box position='absolute' w={55} borderRadius={9000} alignItems='center' bgColor='#f89a56' left={10} bottom={30} >
                <Text color='#f0f0f0' fontWeight={900} fontSize={50} onPress={() => navigation.navigate('Add')}>+</Text>
            </Box>
            <Box position='absolute' w={200} borderRadius={9000} alignItems='center' bgColor='#f89a56' right={10} bottom={30} >
                <Text color='#f0f0f0' fontWeight={900} fontSize={50} onPress={() => navigation.navigate('Add')}>Finalizar</Text>
            </Box>

        </GluestackUIProvider >
    );
}

const styles = StyleSheet.create({
    gridContainerr: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        // gap: 16,
        width: '100%',
        height: '100%',
        paddingBottom: 200,

    },
    Buttonshadoww: {

        shadowColor: "#F89A56",
        shadowOffset: {
            width: 0,
            height: 10, // Aumente o valor para uma sombra mais pronunciada
        },
        shadowOpacity: 0.9, // Aumente para uma sombra mais opaca
        shadowRadius: 10, // Ajuste o raio para controlar o espalhamento
        elevation: 20, // Aumente para sombras mais pronunciadas no Android

        borderWidth: .5,
        borderColor: '#F89A564D'
    },
    shadoww: {

        marginBottom: 5,
        shadowColor: "#F89A56",
        shadowOffset: {
            width: 0,
            height: 10, // Aumente o valor para uma sombra mais pronunciada
        },
        shadowOpacity: 0.9, // Aumente para uma sombra mais opaca
        shadowRadius: 10, // Ajuste o raio para controlar o espalhamento
        elevation: 20, // Aumente para sombras mais pronunciadas no Android

        borderWidth: .5,
        borderColor: '#F89A564D'
    }
});