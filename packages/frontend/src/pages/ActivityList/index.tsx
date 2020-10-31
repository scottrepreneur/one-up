import React, { FunctionComponent } from 'react';
import { Box, Text, Flex, PseudoBox } from '@chakra-ui/core'; 
import { useTheme } from "@chakra-ui/core";

import { useUserDbData } from '../../contexts/Application';
import { ActivityRecord } from '../../utils';

const ActivityList: FunctionComponent = () => {
  const dbData = useUserDbData();
  const activities = dbData?.activities && JSON.parse(dbData?.activities);
  const theme = useTheme();
  console.log(theme);

  return (
    <Box w='70%' m='0 auto'>
      <Text fontSize='24px' fontWeight={700} textAlign='center' mt={25} color='white'>Activities</Text>
      <Box pt={20}>
        {activities ? (
          activities.map((activity: ActivityRecord) => {
            return (
              <PseudoBox as={Flex} key={activity.activity} _hover={{ cursor: 'pointer', backgroundColor: theme.colors.blue[50] }}>
                <Flex w='50%' direction='column' justify='center' color='white'>
                  {activity.name}
                </Flex>
                <Flex w='50%' direction='column' justify='center' color='white'>
                  {activity.points} points
                </Flex>
              </PseudoBox>
            );
          })
        ) : (
          <Flex justify='center' color='white'>No Activities Found. Create One!</Flex>
        )}
      </Box>
    </Box>
  );
};

export default ActivityList;
