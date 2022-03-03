import { Component, useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface DashboardProps {
}

interface FoodType {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string
  available: boolean;
}


interface AddFood{
  image: string;
  name:  string;
  price: string; 
  description: string;
}

export default function Dashboard({}:DashboardProps ){  
  const [foods, setFoods] = useState<FoodType[]>([]);
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {    
    async function getFood(){
      const response = await api.get('/foods');
      setFoods(response.data)
    }
    getFood()
  }, [])

  const handleAddFood = async (food: AddFood)=> {
    try{
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])

    }catch(err){
      console.log(err);
    }
  }
  const handleUpdateFood = async (food: AddFood):Promise<void> => {
    try{
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );
      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );
      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }
  const handleDeleteFood = async  (foodId: Number) => {
    await api.delete(`/foods/${foodId}`);

    const foodsFiltered = foods.filter(food => food.id !== foodId);

    setFoods(foodsFiltered);
  }

  function toggleModal (){
    setModalOpen(!modalOpen);
  }

  function toggleEditModal () {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood (food: FoodType ){
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );


}

