// importando supabase
import { supabase } from '../../ClientSupabase'

import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Heading, Image, GluestackUIProvider, Text, Box, Center, VStack, HStack, styled, set } from '@gluestack-ui/themed';

// button depencencias
import {
    Button,
    ButtonText,
    ButtonIcon,
    ButtonSpinner,
    ButtonGroup,
} from "@gluestack-ui/themed"

import { Input, InputField } from '@gluestack-ui/themed';

import * as ImagePicker from 'expo-image-picker';


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



export default function ImagePickerExample() {
    // form que ira para o supabase
    const [value, setValue] = useState('5.50');
    const [image, setImage] = useState(null);
    const [NomeProd, setNome] = useState(' ');
    const [TipoProd, setTipo] = useState(1);





    useEffect(() => {
        console.log(NomeProd.replace(/ /g, '_'));
        console.log(value)
        console.log(`FotosProdutos/${NomeProd.replace(/ /g, '_')}`)
        image ? console.log(image.split('/').pop()) : console.log('ainda nao')
    }, [NomeProd]); // El segundo argumento es un array de dependencias, si estas cambian, el efecto se vuelve a ejecutar



    async function addToTable(ImageUriPublic) {
        try {
            const { data, error } = await supabase
                .from('cardsInfo')
                .insert([
                    { tipo: TipoProd, nome: NomeProd, valor: value, imgUrl: ImageUriPublic }
                ]);

            if (error) {
                throw error;
            }

            console.log('Linha adicionada com sucesso:', data);
            return data;
        } catch (error) {
            console.error('Erro ao adicionar linha na tabela:', error.message);
            return null;
        }
    }



    const uploadImage = async () => {
        try {

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

                    addToTable(data.publicUrl); // Chama addToTable apenas se data.publicUrl for válido
                    clearInterval(intervalId); // Encerra o intervalo após sucesso

                } else {
                    console.error("Erro ao obter a URL pública da imagem. Tentando novamente...");
                }
            }, 3000);


            Alert.alert('Foto enviada com sucesso', 'espere 5 segundos para salvar corretamente');

        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload failed', error.message);
        }
    };

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
            mediaTypes: ImagePicker.MediaTypeOptions.All,
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

    return (
        <View style={styles.container}>
            <VStack width={'100%'} height={'100%'} alignItems='center' justifyContent='flex-start'>
                <Heading style={styles.TituloAdd} marginTop={50}>Foto</Heading>
                <View style={styles.containerPhoto}>
                    <Button style={{ width: '100%', height: '100%' }} borderRadius={30} bgColor='#282f3d' size="md" variant="solid" action="primary" onPress={pickImage} isDisabled={false} isFocusVisible={false} >
                        <ButtonText fontSize={40}> ADD FOTO </ButtonText>
                    </Button>

                    {image && <Image alt='imagem teste' borderRadius={10} source={{ uri: image }} style={styles.image} />}

                </View>

                <Heading style={styles.TituloAdd}>Nome do Produto</Heading>
                <Input style={styles.InputStyles} variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >

                    <InputField
                        placeholder='Nome do Produto'
                        fontSize={20}
                        value={NomeProd}
                        onChangeText={setNome} // Use a função handleNomeChange para lidar com as mudanças no input
                    />
                </Input>
                <Heading style={styles.TituloAdd}>valor do Produto</Heading>
                <Input position='relative' style={styles.InputStyles} variant="outline" size="md" isDisabled={false} isInvalid={false} isReadOnly={false} >

                    <Text position='absolute' fontSize={20} fontWeight={900} top={'50%'} left={30}>R$</Text>

                    <InputField
                        fontSize={20}
                        marginLeft={20}
                        placeholder='valor do Produto'
                        keyboardType='numeric'
                        type='number'
                        onChangeText={handleChange}
                        value={value}
                    />


                </Input>
                <Text style={styles.formattedText}>
                    {formatCurrency(value)}
                </Text>

                <Heading style={styles.TituloAdd}>Tipo de Produto</Heading>
                <Box >
                    <HStack alignItems='center' justifyContent='space-around' w={'90%'}>
                        <Text backgroundColor={item1} onPress={() => { setTipo(1); setItem1('#f89a56'); setItem2('#fff'); setItem3('#fff') }} style={[styles.Text, styles.ShadowBorder]}>Bebida</Text>
                        <Text backgroundColor={item2} onPress={() => { setTipo(2); setItem1('#fff'); setItem2('#f89a56'); setItem3('#fff') }} style={[styles.Text, styles.ShadowBorder]}>Comida</Text>
                        <Text backgroundColor={item3} onPress={() => { setTipo(3); setItem1('#fff'); setItem2('#fff'); setItem3('#f89a56') }} style={[styles.Text, styles.ShadowBorder]}>Brinquedo</Text>
                    </HStack>
                </Box>
                <Text onPress={uploadImage} style={styles.ShadowBorder} position='absolute' bottom={30} bgColor='#ffe6d4' color='#f89a56' fontWeight={900} fontSize={50} width={'90%'} height={60} textAlignVertical='center' textAlign='center'>Criar Produto</Text>
            </VStack>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // alignItems: "center",
        // justifyContent: "center",
        backgroundColor: '#f0f0f0'

    },
    Text: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '900',
        color: '#664e3c',
        width: '28%',
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center'
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
    TituloAdd: {
        fontSize: 40,
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
});
