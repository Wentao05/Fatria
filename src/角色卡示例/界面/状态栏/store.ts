<<<<<<< HEAD
import { Schema } from '../../schema';

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
=======
import { defineMvuDataStore } from '@/util/mvu';
import { Schema } from '../../schema';

export const useDataStore = defineMvuDataStore(Schema, { type: 'message', message_id: getCurrentMessageId() });
>>>>>>> 4e2a9fc6b9f5ae825823eb357fffa0d0ea284155
