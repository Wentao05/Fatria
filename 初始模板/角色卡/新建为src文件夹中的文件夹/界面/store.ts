<<<<<<< HEAD
import { Schema } from '../../schema';
=======
import { Schema } from '../schema';
>>>>>>> 6939e54f496efe6c9e3921f663a5fa29e6ff3ddc

export const useDataStore = defineStore('data', () => {
  const message_id = getCurrentMessageId();
  const data = ref(Schema.parse(_.get(getVariables({ type: 'message', message_id }), 'stat_data', {})));

  watchEffect(() => {
    updateVariablesWith(
      variables => {
        _.set(variables, 'stat_data', klona(data.value));
        return variables;
      },
      { type: 'message', message_id },
    );
  });

  return { data };
});
