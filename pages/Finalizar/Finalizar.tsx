// importando supabase
import { supabase } from '../../ClientSupabase'
import React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { Heading, Image, GluestackUIProvider, Text, Box, Center, VStack, HStack, styled, set } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';// button depencencias
import {
    Button,
    ButtonText,
    ButtonIcon,
    ButtonSpinner,
    ButtonGroup,
} from "@gluestack-ui/themed"
import { Input, InputField } from '@gluestack-ui/themed';

import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');



export default function ImagePickerExample({ atualizaPagina, setatualizaPagina, ItensEscolhidos, setItensEscolhidos, setLimparSelecao, LimparSelecao }) {
    const navigation = useNavigation();


    const [ValorTotal, setValorTotal] = useState(0);
    const [ValorRecebido, setValorRecebido] = useState(0.0);
    const [ValorTroco, setValorTroco] = useState(0);

    const CalcTroco = () => {
        console.log('RECEBIDO aqiu', ValorRecebido)
        console.log('TOTAL aqiu', ValorTotal)

        const trocoCalculado = ValorRecebido - ValorTotal;

        setValorTroco(trocoCalculado);
        console.log('TROCO aqiu', ValorTroco)

    }
    useEffect(() => {
        CalcTroco();
    }, [ValorRecebido])

    const CalcValorTotal = () => {

        console.log('esses sao os selecionados', ItensEscolhidos);
        if (ItensEscolhidos && ItensEscolhidos.length > 0) {
            let total = 0;
            ItensEscolhidos.forEach((element) => {
                total += (element.valor * element.quantidade);
            });
            setValorTotal(total);
            console.log(total);

        }
    };
    useEffect(() => {
        CalcValorTotal();
    }, [ItensEscolhidos]);

    const handleChange = (numero) => {
        let numeroFinal = 0;

        if (numero.includes(',')) {
            // Se o número contém um ponto decimal, apenas o mantenha como está
            numeroFinal = numero.replace(',', '.');
            numeroFinal = parseFloat(numeroFinal);
        }

        setValorRecebido(numeroFinal);
    };
    const [_, forceUpdate] = useState(); // Criando um estado apenas para forçar a atualização

    const incrementarQuantidade = (index) => {
        ItensEscolhidos[index].quantidade++;
        forceUpdate({}); // Forçar a atualização do componente
        CalcValorTotal()
    };

    const decrementarQuantidade = (index) => {
        if (ItensEscolhidos[index].quantidade > 0) {
            ItensEscolhidos[index].quantidade--;
            forceUpdate({}); // Forçar a atualização do componente
            CalcValorTotal()
        }
    };

    function ClearSelection() {
        setLimparSelecao(true)
        navigation.navigate('Home')
    }
    return (
        <View style={styles.View}>
            <ScrollView>
                <Box style={styles.container}>


                    <Text style={styles.Titulo}>PRODUTOS</Text>
                    <Box rowGap={10} minHeight={300} marginHorizontal={'auto'} backgroundColor='#fff' style={styles.ShadowBorder} padding={20} width={'90%'} >
                        {/* card */}
                        {ItensEscolhidos.map((element, index) => (
                            <React.Fragment key={index}>
                                <HStack marginHorizontal={'auto'} justifyContent='space-between' backgroundColor='#fff' style={styles.ShadowBorder} padding={10} width={'100%'}>
                                    <Image
                                        alt='imagem'
                                        height={100}
                                        aspectRatio={1}
                                        source={element.imgUrl}
                                        borderRadius={10}
                                    />
                                    <VStack width={'70%'} justifyContent='space-around'>
                                        <HStack paddingHorizontal={15} width={'100%'} justifyContent='space-between'>
                                            <Text style={styles.textoMedio} color='#664e3c'>{element.nome}</Text>
                                            <Text color='#f89a56' style={styles.textoMedio} > R$ {element.valor * element.quantidade}</Text>
                                        </HStack>
                                        <HStack width={'100%'} style={styles.ShadowBorder} backgroundColor='#fff' padding={15} justifyContent='space-between'>
                                            <Text
                                                onPress={() => { incrementarQuantidade(index) }}
                                                style={styles.textoMedio} padding={10} paddingHorizontal={30} color='#664e3c' >+</Text>
                                            <Text style={styles.textoMedio} color='#664e3c' textAlignVertical='center' >{element.quantidade}</Text>
                                            <Text
                                                onPress={() => { decrementarQuantidade(index) }} padding={10} paddingHorizontal={30} style={styles.textoMedio} color='#664e3c' >-</Text>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </React.Fragment>
                        ))}
                    </Box>

                    {/* valores */}
                    <Text style={styles.Titulo}>VALORES</Text>
                    <VStack rowGap={10} minHeight={300} marginHorizontal={'auto'} backgroundColor='#fff' style={styles.ShadowBorder} padding={20} width={'90%'} >
                        <VStack width={'90%'} marginHorizontal={'auto'}>

                            {ItensEscolhidos.map((element, index) => (
                                <React.Fragment key={index}>
                                    <HStack width={'100%'} backgroundColor='#fff' padding={15} justifyContent='space-between'>
                                        <HStack>
                                            <Text style={styles.textoMedio} color='#664e3c'> {element.nome}</Text>
                                            <Text style={styles.textoMedio} color='#f89a56'> X{element.quantidade}</Text>
                                        </HStack>
                                        <Text style={styles.textoMedio} color='#664e3c'>R${element.valor * element.quantidade}</Text>
                                    </HStack>
                                </React.Fragment>
                            ))}


                        </VStack>
                        <Box marginVertical={10} marginHorizontal={'auto'} width={'90%'} height={1} backgroundColor='black'></Box>
                        <VStack>
                            <HStack width={'100%'} backgroundColor='#fff' padding={15} justifyContent='space-between'>
                                <Text fontWeight={900}
                                    fontSize={20}>TOTAL</Text>
                                <Text fontWeight={900}
                                    fontSize={20}>R$ {ValorTotal}</Text>
                            </HStack>
                            <HStack width={'100%'} backgroundColor='#fff' padding={15} justifyContent='space-between'>
                                <VStack justifyContent='space-between' width={'45%'} >
                                    <Text paddingLeft={10} fontWeight={900} fontSize={20} >RECEBIDO</Text>
                                    <Input variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >

                                        <TextInput
                                            placeholder='valor recebido'
                                            fontSize={20}
                                            height={70}
                                            style={[styles.ShadowBorder]} backgroundColor='#f89a56' padding={10} justifyContent='flex-end'
                                            type='number'
                                            keyboardType='numeric'
                                            onChangeText={handleChange}
                                        />
                                    </Input>
                                </VStack>
                                <VStack width={'45%'} >
                                    <Text paddingLeft={10} fontWeight={900} fontSize={20} justifyContent='flex-end'>TROCO</Text>
                                    <Text textAlignVertical='center' height={70} style={[styles.Titulo, styles.ShadowBorder]} backgroundColor='#56f866' padding={10} justifyContent='flex-end'>R$ {ValorTroco}</Text>
                                </VStack>
                            </HStack>
                        </VStack>
                    </VStack>

                    <Button style={styles.ShadowBorder} borderRadius={15} bgColor='#fff' size="md" height={60} w={'90%'} marginHorizontal={'auto'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} marginVertical={30}>
                        <ButtonText

                            color='#664e3c'
                            fontSize={25}
                            fontWeight={900}
                            onPress={() => { ClearSelection() }}

                        >
                            Voltar ao inicio
                        </ButtonText>
                    </Button>
                </Box>
            </ScrollView >
        </View >

    );
}

const styles = StyleSheet.create({


    View: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e6e6e6',
        paddingTop: 40,

    },
    container: {
        width: width,
        minHeight: height,
        justifyContent: 'space-around',

    },
    Titulo: {
        fontSize: 25,
        fontWeight: 900,
        // color: '#664e3c',
        width: '90%',
        // height: 'auto',
        marginHorizontal: 'auto',
        marginTop: 20,
        marginBottom: 10,

    },
    textoMedio: {
        fontSize: 20,
        fontWeight: 900,
        // width: '90%',
        height: 'auto',

    },
    ShadowBorder: {

        // backgroundColor: '#fff',
        borderRadius: 20,

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


});
