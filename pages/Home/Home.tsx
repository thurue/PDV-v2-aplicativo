// importando supabase
import { supabase } from '../../ClientSupabase'

import { config } from '@gluestack-ui/config'; // Optional if you want to use default theme

import { useEffect, useState } from 'react';
import { Button, ButtonText, ButtonIcon, Image, GluestackUIProvider, Text, Box, Center, VStack, HStack, styled } from '@gluestack-ui/themed';
import { View, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native'; // Importando do 'react-native'
import { useNavigation } from '@react-navigation/native';



// icone Options
import Options from '../../assets/Icones/deleteImg.png'


export default function Home({ atualizaPagina, setatualizaPagina, ItensEscolhidos, setItensEscolhidos }) {
    // const [ItensEscolhidos, setItensEscolhidos] = useState(['teste']);
    useEffect(() => {
        console.log('escolhidos aquiiii', ItensEscolhidos)
    }, [ItensEscolhidos]);

    useEffect(() => {
        setItensEscolhidos([])
    }, []);

    const [Tipo1, setTipo1] = useState('show');
    const [Tipo2, setTipo2] = useState('show');
    const [Tipo3, setTipo3] = useState('show');

    const laranja = '#f89a56'
    const cinza = '#b59883'


    const [TodosColor, setTodosColor] = useState(laranja);
    const [BebidasColor, setBebidasColor] = useState(cinza);
    const [ComidasColor, setComidasColor] = useState(cinza);
    const [BrinquedosColor, setBrinquedosColor] = useState(cinza);


    const ApenasTodos = () => {
        setTipo1('show'); setTipo2('show'); setTipo3('show');
        setTodosColor(laranja); setBebidasColor(cinza); setComidasColor(cinza); setBrinquedosColor(cinza)
    }

    const ApenasTipo1 = () => {
        setTipo1('show'); setTipo2('none'); setTipo3('none');
        setTodosColor(cinza); setBebidasColor(laranja); setComidasColor(cinza); setBrinquedosColor(cinza)
    }
    const ApenasTipo2 = () => {
        setTipo1('none'); setTipo2('show'); setTipo3('none');
        setTodosColor(cinza); setBebidasColor(cinza); setComidasColor(laranja); setBrinquedosColor(cinza)
    }
    const ApenasTipo3 = () => {
        setTipo1('none'); setTipo2('none'); setTipo3('show');
        setTodosColor(cinza); setBebidasColor(cinza); setComidasColor(cinza); setBrinquedosColor(laranja)
    }

    const navigation = useNavigation();

    const [TODOS, setTodos] = useState([
        {
            nome: 'Brinquedo pula Pula PUla',
            valor: "4.50",
            imgUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            tipo: 1,
            quantidade: 0,
        },
    ]);

    async function getRowsFromTable() {
        try {
            const { data, error } = await supabase
                .from('cardsInfo')
                .select('*');
            if (error) {
                throw error;
            }

            setTodos(data)
            return data;
        } catch (error) {
            console.error('Erro ao recuperar linhas da tabela:', error);
            return null;
        }
    }

    useEffect(() => {
        if (atualizaPagina == true) {
            setTimeout(() => {
                getRowsFromTable();
                setatualizaPagina(false)

            }, 100);
        }
    }, [atualizaPagina]);

    useEffect(() => {
        console.log(ItensEscolhidos)
        console.log(TODOS)
        console.log(ItensEscolhidos[0])
        console.log(TODOS[0])
    }, [ItensEscolhidos]);

    // efeito botao pressionado
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        setIsPressed(true);
    };

    const handleRelease = () => {
        setIsPressed(false);
    };

    // cancelar / confirmar DELETE
    const [ShowDelete, setShowDelete] = useState('none')

    const [DeleteAtual, setDeleteAtual] = useState('none')

    const handleShow = () => {
        setShowDelete('show');
    };
    const handleHide = () => {
        setShowDelete('none');
    };

    async function DeleteImageAndLineTable(imgName) {
        try {
            // Excluir a linha da tabela
            const { data, error } = await supabase
                .from('cardsInfo')
                .delete()
                .eq('imgName', imgName);

            if (error) {
                console.error('Erro ao excluir linha da tabela:', error.message);
                return;
            }

            console.log('Linha excluída com sucesso:', data);

            // Excluir o arquivo do armazenamento
            const { error: fileError } = await supabase.storage
                .from('FotoProdutos')
                .remove([imgName]);

            if (fileError) {
                console.error('Erro ao excluir arquivo do armazenamento:', fileError.message);
                return;
            }

            console.log('Arquivo excluído com sucesso');
            setatualizaPagina(true)
            setShowDelete('none')
        } catch (error) {
            console.error('Erro ao excluir linha e arquivo:', error.message);
        }
    }



    const handelAdd = (element, index) => {
        TODOS[index].quantidade++
    };


    function handelRemove(element, index) {
        TODOS[index].quantidade--
    };



    function ButtonChange(event, element, index) {
        return (
            event == 0 ? (
                <Button style={styles.Buttonshadoww} borderRadius={15} bgColor='#fff' size="md" height={50} w={'100%'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                    <ButtonText
                        onPress={() => {
                            setItensEscolhidos(prevItens => {
                                const itemIndex = prevItens.findIndex(item => item.nome === element.nome);
                                if (itemIndex !== -1) {
                                    // Item já existe, atualiza a quantidade
                                    handelAdd(element, index)
                                    prevItens[itemIndex].quantidade++;
                                } else {
                                    // Item não existe, adiciona ao array com quantidade inicial 1
                                    element.quantidade = 1
                                    prevItens.push({ ...element, quantidade: 1 });
                                }
                                return [...prevItens]; // Retorna uma nova cópia do array atualizado
                            });
                        }}

                        color='#664e3c'
                        fontSize={20}
                        fontWeight={900}
                    >
                        CARRINHO
                    </ButtonText>
                </Button>

            ) :
                <HStack alignItems='center' justifyContent='space-around' width={'100%'}>
                    <Button style={styles.Buttonshadoww} borderRadius={15} bgColor='#44bc85' size="md" height={50} w={'45%'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                        <ButtonText
                            color='#fff'
                            fontSize={45}
                            fontWeight={900}
                            onPress={() => {
                                setItensEscolhidos(prevItens => {
                                    const itemIndex = prevItens.findIndex(item => item.nome === element.nome);
                                    if (itemIndex !== -1) {
                                        // Item já existe, atualiza a quantidade
                                        handelAdd(element, index)
                                        prevItens[itemIndex].quantidade++;
                                    } else {
                                        // Item não existe, adiciona ao array com quantidade inicial 1
                                        handelAdd(element, index)
                                        prevItens.push({ ...element, quantidade: 1 });
                                    }
                                    return [...prevItens]; // Retorna uma nova cópia do array atualizado
                                });
                            }}

                        >
                            +
                        </ButtonText>
                    </Button>

                    <Button style={styles.Buttonshadoww} borderRadius={15} bgColor='red' height={50} size="md" w={'40%'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                        <ButtonText
                            color='#fff'
                            fontSize={45}
                            fontWeight={900}
                            onPress={() => {
                                setItensEscolhidos(prevItens => {
                                    const itemIndex = prevItens.findIndex(item => item.nome === element.nome);
                                    if (itemIndex !== -1) {
                                        // Item já existe, atualiza a quantidade
                                        handelRemove(element, index)
                                        prevItens[itemIndex].quantidade--;
                                    } else {
                                        // Item não existe, adiciona ao array com quantidade inicial 1
                                        element.quantidade = 1
                                        prevItens.push({ ...element, quantidade: 1 });
                                    }
                                    return [...prevItens]; // Retorna uma nova cópia do array atualizado
                                });
                            }}
                        >
                            -
                        </ButtonText>
                    </Button>
                </HStack>

        );
    }

    return (
        <GluestackUIProvider config={config}>

            <VStack bgColor='#f0f0f0'>

                <HStack width="100%" w={'100%'} h={'$20'} marginTop={'0%'} marginBottom={10} reversed={false} >

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text onPress={() => { ApenasTodos() }} h={20} fontWeight={900} color={TodosColor}>TODOS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={TodosColor}></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text onPress={() => { ApenasTipo1() }} h={20} fontWeight={900} color={BebidasColor}>BEBIDAS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={BebidasColor}></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text onPress={() => { ApenasTipo2() }} h={20} fontWeight={900} color={ComidasColor}>COMIDAS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={ComidasColor}></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='25%' >
                        <Text onPress={() => { ApenasTipo3() }} h={20} fontWeight={900} color={BrinquedosColor}>BRINQUEDOS</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={BrinquedosColor}></Box>
                    </VStack>

                </HStack>
                <ScrollView >

                    <View style={styles.gridContainerr}>

                        {TODOS &&
                            TODOS.map((element, index) => {
                                if (element.tipo == 1) {
                                    return (
                                        <VStack
                                            display={Tipo1}
                                            key={index}
                                            position='relative'
                                            alignItems='center'
                                            justifyContent='space-evenly'
                                            w='48%'
                                            bg='#ffffff'
                                            borderRadius={20}
                                            gap={10}
                                            padding={10}
                                            paddingVertical={15}
                                        >
                                            <Image
                                                alt='imagem'
                                                height={160}
                                                aspectRatio={1}
                                                borderRadius={15}
                                                source={{
                                                    uri: element.imgUrl
                                                }}
                                            />

                                            {/* <Button
                                                flex={1}
                                                position='absolute'
                                                right={'12%'}
                                                top={'1.5%'}
                                                onPress={() => { handleShow(); setDeleteAtual(element.imgName) }}
                                                backgroundColor='transparent'
                                                paddingHorizontal={0}
                                            >
                                                <Image
                                                    alt='imagem'
                                                    size="2xs"
                                                    source={Options}
                                                />
                                            </Button> */}
                                            <HStack maxHeight={50} space='xl'>

                                                <Text textAlignVertical='center' color='#664e3c' width={'50%'} fontSize={20} fontWeight={900}>{element.nome}</Text>
                                                <Text textAlignVertical='center' color='#f89a56' fontSize={20} fontWeight={900}>R$ {JSON.parse(element.valor).toFixed(2)}</Text>

                                            </HStack>

                                            {ButtonChange(element.quantidade, element, index)}

                                            <Text
                                                position='absolute'
                                                left={10}
                                                padding={5}
                                                backgroundColor={TODOS[index].quantidade > 0 ? '#f89a56' : null}
                                                borderRadius={100}
                                                color='#fff'
                                                fontWeight={900}
                                            >
                                                {element.quantidade > 0 ? element.quantidade : null}
                                            </Text>

                                        </VStack>
                                    );
                                }
                                if (element.tipo == 2) {
                                    return (
                                        <VStack
                                            display={Tipo2}
                                            key={index}
                                            position='relative'
                                            alignItems='center'
                                            justifyContent='space-evenly'
                                            w='48%'
                                            bg='#ffffff'
                                            borderRadius={20}
                                            gap={10}
                                            padding={10}
                                            paddingVertical={15}
                                        >
                                            <Image
                                                alt='imagem'
                                                height={160}
                                                aspectRatio={1}
                                                borderRadius={15}
                                                source={{
                                                    uri: element.imgUrl
                                                }}
                                            />

                                            {/* <Button
                                                flex={1}
                                                position='absolute'
                                                right={'12%'}
                                                top={'1.5%'}
                                                onPress={() => { handleShow(); setDeleteAtual(element.imgName) }}
                                                backgroundColor='transparent'
                                                paddingHorizontal={0}
                                            >
                                                <Image
                                                    alt='imagem'
                                                    size="2xs"
                                                    source={Options}
                                                />
                                            </Button> */}
                                            <HStack maxHeight={50} space='xl'>

                                                <Text textAlignVertical='center' color='#664e3c' width={'50%'} fontSize={20} fontWeight={900}>{element.nome}</Text>
                                                <Text textAlignVertical='center' color='#f89a56' fontSize={20} fontWeight={900}>R$ {JSON.parse(element.valor).toFixed(2)}</Text>

                                            </HStack>

                                            {ButtonChange(element.quantidade, element, index)}

                                            <Text
                                                position='absolute'
                                                left={10}
                                                padding={5}
                                                backgroundColor={TODOS[index].quantidade > 0 ? '#f89a56' : null}
                                                borderRadius={100}
                                                color='#fff'
                                                fontWeight={900}
                                            >
                                                {element.quantidade > 0 ? element.quantidade : null}
                                            </Text>

                                        </VStack>
                                    );
                                }
                                if (element.tipo == 3) {
                                    return (
                                        <VStack
                                            display={Tipo3}
                                            key={index}
                                            position='relative'
                                            alignItems='center'
                                            justifyContent='space-evenly'
                                            w='48%'
                                            bg='#ffffff'
                                            borderRadius={20}
                                            gap={10}
                                            padding={10}
                                            paddingVertical={15}
                                        >
                                            <Image
                                                alt='imagem'
                                                height={160}
                                                aspectRatio={1}
                                                borderRadius={15}
                                                source={{
                                                    uri: element.imgUrl
                                                }}
                                            />

                                            {/* <Button
                                                flex={1}
                                                position='absolute'
                                                right={'12%'}
                                                top={'1.5%'}
                                                onPress={() => { handleShow(); setDeleteAtual(element.imgName) }}
                                                backgroundColor='transparent'
                                                paddingHorizontal={0}
                                            >
                                                <Image
                                                    alt='imagem'
                                                    size="2xs"
                                                    source={Options}
                                                />
                                            </Button> */}
                                            <HStack maxHeight={50} space='xl'>

                                                <Text textAlignVertical='center' color='#664e3c' width={'50%'} fontSize={20} fontWeight={900}>{element.nome}</Text>
                                                <Text textAlignVertical='center' color='#f89a56' fontSize={20} fontWeight={900}>R$ {JSON.parse(element.valor).toFixed(2)}</Text>

                                            </HStack>

                                            {ButtonChange(element.quantidade, element, index)}

                                            <Text
                                                position='absolute'
                                                left={10}
                                                padding={5}
                                                backgroundColor={TODOS[index].quantidade > 0 ? '#f89a56' : null}
                                                borderRadius={100}
                                                color='#fff'
                                                fontWeight={900}
                                            >
                                                {element.quantidade > 0 ? element.quantidade : null}
                                            </Text>

                                        </VStack>
                                    );
                                }

                            })
                        }


                    </View>

                </ScrollView>
            </VStack>
            <Box position='absolute' paddingHorizontal={10} borderRadius={9000} alignItems='center' bgColor='#f89a56' left={10} bottom={30} >
                <Text color='#f0f0f0' fontWeight={900} fontSize={30} padding={10} onPress={() => navigation.navigate('Add')}>Prod</Text>
            </Box>
            <Box position='absolute' paddingHorizontal={10} borderRadius={9000} alignItems='center' bgColor='#f89a56' right={10} bottom={30} >
                <Text color='#f0f0f0' fontWeight={900} fontSize={30} padding={10} onPress={() => navigation.navigate('Finalizar')}>Finalizar</Text>
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
        rowGap: 5,
        width: '100%',
        height: '100%',
        paddingBottom: 200,

    },
    background: {
        flex: 1,
        resizeMode: 'cover', // Ou 'contain' para ajustar o modo de exibição da imagem de fundo
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000080'

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
    ButtonshadowwConfirm: {

        // shadowColor: "#F89A56",
        shadowOffset: {
            width: 10,
            height: 10, // Aumente o valor para uma sombra mais pronunciada
        },
        shadowOpacity: .9, // Aumente para uma sombra mais opaca
        shadowRadius: 1, // Ajuste o raio para controlar o espalhamento
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
    },
    button: {
        backgroundColor: 'transparent',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        height: '45%',
        shadowColor: 'transparent',
        elevation: 0

    },
    buttonControlQuantidade: {
        flex: 1

    },
    buttonPressed: {
        backgroundColor: 'transparent', elevation: 30
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    }

});