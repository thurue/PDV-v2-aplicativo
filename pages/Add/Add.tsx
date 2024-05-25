// importando supabase
import { supabase } from '../../ClientSupabase'

import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { Heading, Image, GluestackUIProvider, Text, Box, Center, VStack, HStack, styled, set, ScrollView } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';// button depencencias
import {
    Button,
    ButtonText,
    ButtonIcon,
    ButtonSpinner,
    ButtonGroup,
} from "@gluestack-ui/themed"

import { Input, InputField } from '@gluestack-ui/themed';

import * as ImagePicker from 'expo-image-picker';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const formatCurrency = (value) => {
    // Remove any non-numeric characters except commas and periods
    value = value.replace(/[^0-9,.]/g, '');

    // Replace commas with periods to handle European decimal notation
    value = value.replace(',', '.');

    // Convert to a float and then format
    let number = parseFloat(value);
    if (isNaN(number)) {
        number = 0;
    }

    // Format the number to Brazilian currency
    return number.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });
};


export default function ImagePickerExample({ atualizaPagina, setatualizaPagina }) {



    const navigation = useNavigation();
    const [ShowLoading, setShowLoading] = useState('none');

    // form que ira para o supabase
    const [value, setValue] = useState('');
    const [image, setImage] = useState(null);
    const [NomeProd, setNome] = useState('');
    const [TipoProd, setTipo] = useState(1);


    useEffect(() => {
        console.log(NomeProd.replace(/ /g, '_'));
        console.log(value)
        console.log(`FotosProdutos/${NomeProd.replace(/ /g, '_')}`)
        image ? console.log(image.split('/').pop()) : console.log('ainda nao')
    }, [NomeProd]);


    async function addToTable(ImageUriPublic: string, NomeImagem: string) {
        try {
            let ValorFinal = value.replace(',', '.')
            const { data, error } = await supabase
                .from('cardsInfo')
                .insert([
                    { tipo: TipoProd, nome: NomeProd, valor: ValorFinal, imgUrl: ImageUriPublic, imgName: NomeImagem, quantidade: 0 }
                ]);

            if (error) {
                throw error;
            }

            console.log('Linha adicionada com sucesso:', data);
            setatualizaPagina(true)
            setShowLoading('none')
            navigation.navigate('Home')
            return data;
        } catch (error) {
            console.error('Erro ao adicionar linha na tabela:', error.message);
            return null;
        }
    }
    const uploadImage = async () => {
        if (value && image && NomeProd) {

            try {
                setShowLoading('true')

                const imgType = image.split('.').pop();
                const imgUrl = image;
                const imgName = image.split('/').pop();
                const filePath = `${imgName}`;

                const { data, error } = await supabase.storage
                    .from('FotoProdutos') // Substitua pelo nome do seu bucket
                    .upload(filePath, {
                        uri: imgUrl,
                        type: `image/${imgType}`,
                        name: imgName,
                    });

                if (error) {
                    throw error;
                }


                const intervalId = setInterval(async () => {
                    const { data, errorIMG } = await supabase.storage
                        .from('FotoProdutos')
                        .getPublicUrl(imgName);
                    console.log('AQUI aqui 2', data?.publicUrl);
                    if (data && data.publicUrl) {

                        addToTable(data.publicUrl, imgName); // Chama addToTable apenas se data.publicUrl for válido
                        clearInterval(intervalId); // Encerra o intervalo após sucesso

                    } else {
                        console.error("Erro ao obter a URL pública da imagem. Tentando novamente...");
                    }
                }, 3000);


                // Alert.alert('Foto enviada com sucesso', 'espere 5 segundos para salvar corretamente');

            } catch (error) {
                console.error('Error uploading image:', error);
                Alert.alert('Upload de imagem Falhou', error.message);
            }
        } else { alert('preencha todos os campos') }

    };
    // gerencia Deleta
    const [ShowDelete, setShowDelete] = useState('none')

    const [DeleteAtual, setDeleteAtual] = useState('none')

    const handleShow = () => {
        setShowDelete('show');
    };
    const handleHide = () => {
        setShowDelete('none');
    };
    // efeito botao pressionado
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => {
        setIsPressed(true);
    };

    const handleRelease = () => {
        setIsPressed(false);
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
    // gerencia qual item aparece selecionado em baixo da pagina
    const [item1, setItem1] = useState('#f89a56');
    const [item2, setItem2] = useState('#fff');
    const [item3, setItem3] = useState('#fff');

    // faz a alteração dos valores
    const handleChange = (text) => {
        setValue(text);
    };
    // imagem
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log(result.assets[0].uri)
        }
    };

    const [FocusText, setFocusText] = useState(false);
    const [FocusValue, setFocusValue] = useState(false);

    // pega itens da tabela
    const [ItensTabela, setItensTabela] = useState([
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

            setItensTabela(data)
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

    // controle de exibicao na tela

    const laranja = '#f89a56'
    const cinza = '#b59883'

    const [Exibindo, setExibindo] = useState(1);

    const [AdicionarColor, setAdicionarColor] = useState(laranja);
    const [RemoverColor, setRemoverColor] = useState(cinza);

    const ApenasAdicionar = () => {
        setAdicionarColor(laranja); setRemoverColor(cinza)
    }
    const ApenasRemover = () => {
        setAdicionarColor(cinza); setRemoverColor(laranja)
    }

    return (
        <>
            <View style={Exibindo == 2 ? styles.FlexContainer : styles.container}>

                <HStack width="100%" w={'100%'} h={'$12'} marginTop={'0%'} marginBottom={10} reversed={false} >

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='50%' >
                        <Text onPress={() => { ApenasAdicionar(); setExibindo(1) }} h={20} fontWeight={900} color={AdicionarColor}>Adicionar</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={AdicionarColor}></Box>
                    </VStack>

                    <VStack flexDirection='column' justifyContent='flex-end' alignItems='center' w='50%' >
                        <Text onPress={() => { ApenasRemover(); setExibindo(2); setatualizaPagina(true) }} h={20} fontWeight={900} color={RemoverColor}>Remover</Text>
                        <Box marginVertical={0} w='95%' margin={'auto'} borderRadius={100} h={5} bg={RemoverColor}></Box>
                    </VStack>


                </HStack>
                {Exibindo == 1 ?

                    <ScrollView
                    >

                        <VStack flexGrow={1} width={'100%'} rowGap={20} alignItems='center' justifyContent='space-around'>
                            <Heading style={styles.TituloAdd} marginTop={10}>Foto</Heading>
                            <View style={styles.containerPhoto}>
                                <Button style={{ width: '100%', height: '100%' }} borderRadius={30} bgColor='#282f3d' size="md" variant="solid" action="primary" onPress={pickImage} isDisabled={false} isFocusVisible={false} >
                                    <ButtonText fontSize={40}> ADD FOTO </ButtonText>
                                </Button>

                                {image && <Image alt='imagem teste' borderRadius={10} source={{ uri: image }} style={styles.image} />}

                            </View>

                            <Heading style={styles.TituloAdd}>Nome do Produto</Heading>
                            <Input style={[styles.InputStyles, FocusText && styles.inputFieldFocus]} variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >

                                <InputField
                                    placeholder='Nome do Produto'
                                    fontSize={20}
                                    value={NomeProd}
                                    onChangeText={setNome} // Use a função handleNomeChange para lidar com as mudanças no input
                                />
                            </Input>
                            <Heading style={styles.TituloAdd}>valor do Produto</Heading>
                            <Input position='relative' style={[styles.InputStyles, FocusValue && styles.inputFieldFocus]} variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >

                                <Text style={styles.Reais} position='absolute' fontSize={20} fontWeight={900} top={'50%'} left={30}>R$</Text>

                                <InputField
                                    fontSize={20}
                                    marginLeft={20}
                                    placeholder='5,50'
                                    keyboardType='numeric'
                                    type='number'
                                    onChangeText={handleChange}
                                    value={value}
                                />


                            </Input>
                            {/* <Text style={styles.formattedText}>
                                {formatCurrency(value)}
                            </Text> */}

                            <Heading style={styles.TituloAdd}>Tipo de Produto</Heading>
                            <Box >
                                <HStack alignItems='center' justifyContent='space-around' w={'100%'}>
                                    <Text onPressIn={() => { setTipo(1); console.log(TipoProd) }} backgroundColor={item1} onPress={() => { setTipo(1); setItem1('#f89a56'); setItem2('#fff'); setItem3('#fff') }} style={[styles.Text, styles.ShadowBorder]}>Bebida</Text>
                                    <Text onPressIn={() => { setTipo(2); console.log(TipoProd) }} backgroundColor={item2} onPress={() => { setTipo(2); setItem1('#fff'); setItem2('#f89a56'); setItem3('#fff') }} style={[styles.Text, styles.ShadowBorder]}>Comida</Text>
                                    <Text onPressIn={() => { setTipo(3); console.log(TipoProd) }} backgroundColor={item3} onPress={() => { setTipo(3); setItem1('#fff'); setItem2('#fff'); setItem3('#f89a56') }} style={[styles.Text, styles.ShadowBorder]}>Brinquedo</Text>
                                </HStack>
                            </Box >
                            <Text marginTop={30} marginBottom={100} onPress={uploadImage} style={styles.ShadowBorder} bgColor='#ffe6d4' color='#f89a56' fontWeight={900} fontSize={30} width={'90%'} height={60} textAlignVertical='center' textAlign='center'>Criar Produto</Text>
                        </VStack >
                        <Box display={ShowLoading} bgColor='#000000CC' justifyContent='center' backgroundColor='#000000CC' position='absolute' height={'100%'} width={'100%'}>
                            <Image
                                alignSelf='center'

                                size='xl'
                                alt='loading'
                                source={{ uri: 'https://www.camarajaciara.mt.gov.br/transparencia/images/loading.gif' }}
                            />
                        </Box>
                    </ScrollView>
                    :

                    <ScrollView
                        flex={1}

                    >
                        <View
                            style={styles.FlexContainerDelete}>
                            {
                                ItensTabela.map((element, index) => {
                                    console.log(element)
                                    if (Exibindo == 2) {
                                        return (
                                            <VStack
                                                style={styles.ShadowBorder}
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


                                                <Text textAlignVertical='center' color='#664e3c' textAlign='center' width={'90%'} style={[styles.TextoM]} fontWeight={900}>{element.nome}</Text>
                                                <Text textAlignVertical='center' color='#f89a56' style={[styles.TextoM]} fontWeight={900}>R$ {JSON.parse(element.valor).toFixed(2).replace('.', ',')}</Text>


                                                <Button style={styles.ShadowBorder} borderRadius={15} bgColor='#fff' size="md" height={50} w={'100%'} variant="solid" action="primary" isDisabled={false} isFocusVisible={false} >
                                                    <ButtonText
                                                        onPress={() => { handleShow(); setDeleteAtual(element.imgName) }}

                                                        color='#664e3c'
                                                        fontSize={20}
                                                        fontWeight={900}
                                                    >
                                                        DELETAR
                                                    </ButtonText>
                                                </Button>

                                            </VStack>
                                        )
                                    }
                                }
                                )
                            }
                        </View>
                    </ScrollView>
                }
            </View >
            <Center display={ShowDelete} style={styles.background} blurRadius={10} >
                <VStack padding={10} width={"80%"} height={'40%'} backgroundColor='#fff' borderRadius={30} alignItems='center' justifyContent='space-evenly' >
                    <TouchableOpacity
                        onPress={() => { handlePress; handleHide() }}
                        onPressOut={() => { handleRelease }}
                        activeOpacity={0.5} // Define a opacidade quando o botão é pressionado
                        style={[styles.button, isPressed && styles.buttonPressed]}
                    >

                        <Text width={'100%'} height={'100%'} color='#fff' textTransform='uppercase' fontWeight={900} fontSize={40} backgroundColor='red' textAlign='center' textAlignVertical='center' borderRadius={30} style={styles.ButtonshadowwConfirm} shadowColor='red'  >Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { handlePress; DeleteImageAndLineTable(DeleteAtual) }}
                        onPressOut={handleRelease}
                        activeOpacity={0.5} // Define a opacidade quando o botão é pressionado
                        style={[styles.button, isPressed && styles.buttonPressed]}
                    >
                        <Text width={'100%'} height={'100%'} color='#fff' textTransform='uppercase' fontWeight={900} fontSize={40} backgroundColor='green' textAlign='center' textAlignVertical='center' borderRadius={30} style={styles.ButtonshadowwConfirm} shadowColor='green'>Confirmar</Text>
                    </TouchableOpacity>

                </VStack>
            </Center>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    FlexContainer: {
        width: '100%',
        height: '100%',
    },
    FlexContainerDelete: {
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        rowGap: 5,
        width: '100%',
        height: '100%',
        // backgroundColor: 'red',
        // paddingBottom: 200,
    },
    Text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '900',
        color: '#664e3c',
        width: '30%',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,


    },
    InputStyles: {
        fontSize: 60,
        width: '90%',
        color: '#664e3c',
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#fff',
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
    inputFieldFocus: {
        position: 'absolute',
        bottom: 20,
        fontSize: 60,
        width: '90%',
        color: '#664e3c',
        paddingVertical: 10,
        paddingHorizontal: 40,
        backgroundColor: '#fff',
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
        borderColor: '#F89A564D',
        zIndex: 2
    },
    TituloAdd: {
        fontSize: 30,
        width: '90%',
        color: '#664e3c'


    },
    containerPhoto: {
        width: '90%',
        aspectRatio: '2/1',
        position: 'relative',

        borderRadius: 20,

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

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
    scrollView: {
        flex: 1,

    },
    Reais: {
        position: 'absolute',
        fontSize: 20,
        fontWeight: '900',
        textAlign: 'center',
        left: 30, // Centraliza horizontalmente
        top: 10, // Centraliza verticalmente
    },
    buttonPressed: {
        backgroundColor: 'transparent', elevation: 30
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
    background: {
        resizeMode: 'cover', // Ou 'contain' para ajustar o modo de exibição da imagem de fundo
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000080'

    },
});
